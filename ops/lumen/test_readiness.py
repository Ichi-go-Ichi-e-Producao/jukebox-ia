import copy
import json
import unittest
from pathlib import Path
import check_readiness as review


class SafeguardsTest(unittest.TestCase):
    def setUp(self):
        self.manifest = json.loads((Path(__file__).parent / "pilot.json").read_text())

    def test_current_manifest_is_read_only(self):
        self.assertIs(review.validate_manifest(self.manifest), self.manifest)

    def test_every_commercial_action_is_rejected(self):
        for action in review.FORBIDDEN_ACTIONS:
            with self.subTest(action=action):
                changed = copy.deepcopy(self.manifest)
                changed["automation"][action] = True
                with self.assertRaises(ValueError):
                    review.validate_manifest(changed)

    def test_strings_cannot_pretend_to_be_booleans(self):
        changed = copy.deepcopy(self.manifest)
        changed["pilot"]["print_area_verified"] = "true"
        with self.assertRaises(ValueError):
            review.validate_manifest(changed)

    def test_wrong_store_is_rejected(self):
        changed = copy.deepcopy(self.manifest)
        changed["store"]["public_url"] = "https://wrong-store.example"
        with self.assertRaises(ValueError):
            review.validate_manifest(changed)

    def test_wrong_catalog_count_is_rejected(self):
        changed = copy.deepcopy(self.manifest)
        changed["music_catalog"]["official_releases"] = 7
        with self.assertRaises(ValueError):
            review.validate_manifest(changed)

    def test_fake_publication_is_rejected(self):
        changed = copy.deepcopy(self.manifest)
        changed["pilot"]["product_published"] = True
        changed["pilot"]["supplier_sku_verified"] = False
        with self.assertRaises(ValueError):
            review.validate_manifest(changed)

    def test_fake_wash_test_is_rejected(self):
        changed = copy.deepcopy(self.manifest)
        changed["pilot"]["wash_test_completed"] = True
        changed["pilot"]["sample_received"] = False
        with self.assertRaises(ValueError):
            review.validate_manifest(changed)

    def test_report_keeps_pending_work_explicit(self):
        report = review.render_report(self.manifest, "Teste offline")
        self.assertIn("não autorização comercial", report)
        self.assertIn("Pendente", report)
        self.assertIn("Amostra recebida: não", report)

    def test_arbitrary_network_target_is_rejected_before_request(self):
        with self.assertRaises(ValueError):
            review.public_music_health("https://example.com/")


if __name__ == "__main__":
    unittest.main()
