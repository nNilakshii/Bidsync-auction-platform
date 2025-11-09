package com.bidsync.backend.repository;

import com.bidsync.backend.domain.Bid;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByItemIdOrderByCreatedAtDesc(Long itemId);

    Optional<Bid> findTopByItemIdOrderByAmountDesc(Long itemId);
}
