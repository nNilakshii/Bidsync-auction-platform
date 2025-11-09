package com.bidsync.backend.web.ws;

import com.bidsync.backend.domain.InvalidBidException;
import com.bidsync.backend.dto.BidView;
import com.bidsync.backend.dto.ErrorMessage;
import com.bidsync.backend.dto.PlaceBidPayload;
import com.bidsync.backend.service.AuctionService;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class BidSocketController {

    private final AuctionService service;
    private final SimpMessagingTemplate messagingTemplate;

    public BidSocketController(AuctionService service, SimpMessagingTemplate messagingTemplate) {
        this.service = service;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/items/{itemId}/bid")
    public void submitBid(@DestinationVariable Long itemId, @Valid @Payload PlaceBidPayload payload) {
        BidView bid = service.placeBid(itemId, payload);
        messagingTemplate.convertAndSend("/topic/items/" + itemId + "/bids", bid);
    }

    @MessageExceptionHandler(InvalidBidException.class)
    public void handleInvalidBid(InvalidBidException exception) {
        messagingTemplate.convertAndSend("/queue/errors", new ErrorMessage(exception.getMessage()));
    }
}
