package com.bidsync.backend.service;

import com.bidsync.backend.domain.AuctionItem;
import com.bidsync.backend.domain.Bid;
import com.bidsync.backend.domain.InvalidBidException;
import com.bidsync.backend.dto.AuctionItemDetailView;
import com.bidsync.backend.dto.AuctionItemSummaryView;
import com.bidsync.backend.dto.BidView;
import com.bidsync.backend.dto.PlaceBidPayload;
import com.bidsync.backend.repository.AuctionItemRepository;
import com.bidsync.backend.repository.BidRepository;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class AuctionService {

    private final AuctionItemRepository itemRepository;
    private final BidRepository bidRepository;

    public AuctionService(AuctionItemRepository itemRepository, BidRepository bidRepository) {
        this.itemRepository = itemRepository;
        this.bidRepository = bidRepository;
    }

    @Transactional
    public BidView placeBid(Long itemId, PlaceBidPayload payload) {
        AuctionItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new InvalidBidException("Auction item not found"));

        if (!StringUtils.hasText(payload.bidderDisplayName())) {
            throw new InvalidBidException("Bidder name is required");
        }

        BigDecimal currentPrice = bidRepository.findTopByItemIdOrderByAmountDesc(itemId)
                .map(Bid::getAmount)
                .orElse(item.getStartingPrice());

        if (payload.amount().compareTo(currentPrice) <= 0) {
            throw new InvalidBidException("Bid must be higher than the current price");
        }

        Bid bid = new Bid();
        bid.setAmount(payload.amount());
        bid.setBidderDisplayName(payload.bidderDisplayName().trim());
        bid.setItem(item);

        Bid savedBid = bidRepository.save(bid);
        return toBidView(savedBid);
    }

    @Transactional(readOnly = true)
    public List<AuctionItemSummaryView> fetchSummaries() {
        List<AuctionItem> items = itemRepository.findAll();
        return items.stream().map(this::toSummaryView).toList();
    }

    @Transactional(readOnly = true)
    public AuctionItemDetailView fetchDetail(Long itemId) {
        AuctionItem item = itemRepository.findWithBidsById(itemId)
                .orElseThrow(() -> new InvalidBidException("Auction item not found"));

        List<BidView> bids = item.getBids().stream()
                .sorted(Comparator.comparing(Bid::getCreatedAt).reversed())
                .map(this::toBidView)
                .collect(Collectors.toList());

        BigDecimal currentPrice = bids.stream()
                .findFirst()
                .map(BidView::amount)
                .orElse(item.getStartingPrice());

        return new AuctionItemDetailView(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getImageUrl(),
                item.getStartingPrice(),
                currentPrice,
                bids
        );
    }

    private AuctionItemSummaryView toSummaryView(AuctionItem item) {
        List<Bid> bids = bidRepository.findByItemIdOrderByCreatedAtDesc(item.getId());
        BigDecimal currentPrice = bids.stream()
                .findFirst()
                .map(Bid::getAmount)
                .orElse(item.getStartingPrice());
        OffsetDateTime lastBidTime = bids.stream()
                .findFirst()
                .map(Bid::getCreatedAt)
                .orElse(item.getCreatedAt());
        return new AuctionItemSummaryView(
                item.getId(),
                item.getTitle(),
                item.getImageUrl(),
                currentPrice,
                lastBidTime
        );
    }

    private BidView toBidView(Bid bid) {
        return new BidView(
                bid.getId(),
                bid.getItem().getId(),
                bid.getAmount(),
                bid.getBidderDisplayName(),
                bid.getCreatedAt()
        );
    }
}
