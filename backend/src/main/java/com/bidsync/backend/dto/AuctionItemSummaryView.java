package com.bidsync.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record AuctionItemSummaryView(
        Long id,
        String title,
        BigDecimal currentPrice,
        OffsetDateTime lastBidTime
) {
}
