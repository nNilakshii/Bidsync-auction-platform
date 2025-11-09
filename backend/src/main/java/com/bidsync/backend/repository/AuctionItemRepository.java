package com.bidsync.backend.repository;

import com.bidsync.backend.domain.AuctionItem;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionItemRepository extends JpaRepository<AuctionItem, Long> {

    @EntityGraph(attributePaths = "bids")
    Optional<AuctionItem> findWithBidsById(Long id);
}
