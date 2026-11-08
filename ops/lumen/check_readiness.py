#!/usr/bin/env python3
"""Read-only review: validates a local manifest and optionally GETs public Jukeboxia HTML.

Never accesses Shopify/CJ/Paintory APIs, customer data, email, checkout or payment.
A successful execution means the review ran, NOT that the pilot may be sold.
"""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
FORBIDDEN_ACTIONS = (
    "supplier_mutations", "product_import", "product_publish", "price_changes",
    "inventory_changes", "order_creation", "payments", "auto_payment", "marketing_messages",
)
PILOT_GATES = (
    "supplier_sku_verified", "design_saved_with_supplier", "print_area_verified",
    "final_cost_verified", "shipping_verified",
)
STORE_GATES = ("identity_verified", "checkout_path_verified", "shipping_policy_complete", "refund_policy_complete")
GATE_LABELS = {
    "supplier_sku_verified": "SKU personalizado confirmado pelo fornecedor",
    "design_saved_with_supplier": "Estampa salva e ligada ao produto no fornecedor",
    "print_area_verified": "Área e resolução de impressão verificadas",
    "final_cost_verified": "Custo final e preço revisados",
    "shipping_verified": "Frete e prazo do produto verificados",
    "identity_verified": "Identidade da loja confirmada",
    "checkout_path_verified": "Produto, variante, carrinho e checkout verificados sem pagamento",
    "shipping_policy_complete": "Política de frete completa",
    "refund_policy_complete": "Política de devolução completa",
}


def validate_manifest(data):
    if not isinstance(data, dict) or set(data) != {"schema_version", "store", "music_catalog", "pilot", "store_readiness", "automation"}:
        raise ValueError("Manifesto inválido: campos superiores não permitidos ou ausentes.")
    if data["schema_version"] != 1:
        raise ValueError("Versão de manifesto não suportada.")
    if data["store"] != {"public_url": "https://lumennstory.myshopify.com", "currency": "JPY"}:
        raise ValueError("Loja/moeda divergentes do piloto autorizado.")
    catalog = data["music_catalog"]
    for key, expected in (("total_tracks", 48), ("official_releases", 13), ("collection_ptbr", 7), ("collection_international", 6)):
        if type(catalog.get(key)) is not int or catalog[key] != expected:
            raise ValueError("Referência do catálogo aprovado divergiu; revisar sem apagar músicas.")
    if catalog.get("public_url") != "https://ichi-go-ichi-e-producao.github.io/jukebox-ia/":
        raise ValueError("URL da Jukeboxia não corresponde à publicação autorizada.")
    automation = data["automation"]
    if set(automation) != set(FORBIDDEN_ACTIONS) | {"mode"} or automation["mode"] != "read_only_review":
        raise ValueError("Este fluxo aceita somente revisão de leitura.")
    for action in FORBIDDEN_ACTIONS:
        if automation.get(action) is not False:
            raise ValueError("Automação comercial proibida neste fluxo: " + action)
    pilot, store = data["pilot"], data["store_readiness"]
    for section, keys in ((pilot, PILOT_GATES + ("product_published", "sample_received", "wash_test_completed")), (store, STORE_GATES)):
        for key in keys:
            if type(section.get(key)) is not bool:
                raise ValueError("Verificação deve ser booleano explícito: " + key)
    if pilot.get("status") not in {"prepared_not_listed", "listed_awaiting_sample", "sample_reviewed"}:
        raise ValueError("Estado do piloto não suportado.")
    if pilot["product_published"] and not all(pilot[key] for key in PILOT_GATES):
        raise ValueError("Não declarar produto publicado sem as verificações do fornecedor.")
    if pilot["wash_test_completed"] and not pilot["sample_received"]:
        raise ValueError("Não declarar lavagem testada sem receber a amostra.")
    if pilot["status"] == "sample_reviewed" and not (pilot["sample_received"] and pilot["wash_test_completed"]):
        raise ValueError("Revisão de amostra exige recebimento e teste registrados.")
    return data


def public_music_health(url):
    parsed = urlparse(url)
    if (parsed.scheme, parsed.netloc, parsed.path) != ("https", "ichi-go-ichi-e-producao.github.io", "/jukebox-ia/") or parsed.query or parsed.fragment:
        raise ValueError("Somente o HTML público autorizado da Jukeboxia pode ser consultado.")
    request = Request(url, method="GET", headers={"User-Agent": "LumenReadiness/1.0", "Accept": "text/html"})
    with urlopen(request, timeout=20) as response:
        result_url = urlparse(response.geturl())
        if result_url.netloc != parsed.netloc:
            raise ValueError("Redirecionamento para domínio externo não autorizado.")
        if response.status != 200 or "text/html" not in response.headers.get("Content-Type", ""):
            raise ValueError("A página musical pública não retornou HTML com HTTP 200.")
        if not response.read(65536):
            raise ValueError("A página musical pública retornou conteúdo vazio.")
    return "HTML público respondeu HTTP 200; não é teste de áudio nem de compra."


def render_report(data, health):
    pending = [label for section, keys in ((data["pilot"], PILOT_GATES), (data["store_readiness"], STORE_GATES)) for key in keys if not section[key] for label in [GATE_LABELS[key]]]
    lines = [
        "# Lúmen — revisão de prontidão", "",
        "Verificação UTC: " + datetime.now(timezone.utc).isoformat(), "",
        "**Este relatório não publica, importa, compra ou envia mensagens. CI verde significa revisão concluída, não autorização comercial.**", "",
        "## Estado", "",
        "Loja: " + data["store"]["public_url"] + " · moeda JPY",
        "Estado do piloto: `" + data["pilot"]["status"] + "`",
        "Referência musical: 48 faixas; 13 oficiais, sete PT-BR e seis adaptações desta coleção, preservadas separadamente.",
        "Saúde da Jukeboxia: " + health, "",
        "## Verificações registradas", "",
        "| Verificação | Estado |", "|---|---|",
    ]
    for section, keys in ((data["pilot"], PILOT_GATES), (data["store_readiness"], STORE_GATES)):
        for key in keys:
            lines.append("| " + GATE_LABELS[key] + " | " + ("Confirmado no manifesto" if section[key] else "Pendente") + " |")
    lines += ["", "**Pendências comerciais: " + str(len(pending)) + ".**", "", "O manifesto é um registro humano, não prova de teste vivo. Amostra recebida: " + ("sim" if data["pilot"]["sample_received"] else "não") + "; lavagem testada: " + ("sim" if data["pilot"]["wash_test_completed"] else "não") + ".", "", "Ações de fornecedor, catálogo, preços, estoque, pedidos, pagamentos e marketing automático continuam desabilitadas. Revisar custo/quota de GitHub Actions antes de ampliar execuções. Nenhuma credencial de Shopify, CJ ou Paintory é necessária.", ""]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--offline", action="store_true", help="Não realizar nem a leitura do HTML público.")
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    data = validate_manifest(json.loads((ROOT / "pilot.json").read_text()))
    health = "Não consultada nesta execução offline."
    error = None
    if not args.offline:
        try:
            health = public_music_health(data["music_catalog"]["public_url"])
        except Exception:
            health = "Falha de consulta pública; verificar disponibilidade, rede e domínio. Nenhuma ação comercial executada."
            error = True
    report = render_report(data, health)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(report, encoding="utf-8")
    print(report)
    if error:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
