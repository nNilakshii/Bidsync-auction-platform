package com.bidsync.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record AuctionItemDetailView(
        Long id,
        String title,
        String description,
        BigDecimal startingPrice,
        BigDecimal currentPrice,
        List<BidView> bids
) {
}
