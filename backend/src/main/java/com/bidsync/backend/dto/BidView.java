package com.bidsync.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record BidView(
        Long id,
        Long itemId,
        BigDecimal amount,
        String bidderDisplayName,
        OffsetDateTime createdAt
) {
}
