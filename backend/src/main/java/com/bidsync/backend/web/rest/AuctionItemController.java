package com.bidsync.backend.web.rest;

import com.bidsync.backend.domain.InvalidBidException;
import com.bidsync.backend.dto.AuctionItemDetailView;
import com.bidsync.backend.dto.AuctionItemSummaryView;
import com.bidsync.backend.dto.ErrorMessage;
import com.bidsync.backend.service.AuctionService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
public class AuctionItemController {

    private final AuctionService service;

    public AuctionItemController(AuctionService service) {
        this.service = service;
    }

    @GetMapping
    public List<AuctionItemSummaryView> listItems() {
        return service.fetchSummaries();
    }

    @GetMapping("/{itemId}")
    public AuctionItemDetailView getItem(@PathVariable Long itemId) {
        return service.fetchDetail(itemId);
    }

    @GetMapping("/{itemId}/current-price")
    public ResponseEntity<?> currentPrice(@PathVariable Long itemId) {
        try {
            AuctionItemDetailView detail = service.fetchDetail(itemId);
            return ResponseEntity.ok(detail.currentPrice());
        } catch (InvalidBidException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage(ex.getMessage()));
        }
    }
}
