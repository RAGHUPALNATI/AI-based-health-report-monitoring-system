"""Threshold-based alerting for critical health report values."""

from __future__ import annotations

from typing import Dict, List


class AlertEngine:
    def __init__(self, thresholds: Dict[str, float] | None = None) -> None:
        self.thresholds = thresholds or {}

    def generate_alerts(self, values: Dict[str, float]) -> List[str]:
        alerts: List[str] = []
        for metric, value in values.items():
            threshold = self.thresholds.get(metric)
            if threshold is not None and value >= threshold:
                alerts.append(f"Critical alert: {metric} is {value}, threshold is {threshold}.")
        return alerts
