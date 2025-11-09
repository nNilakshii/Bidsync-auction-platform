package com.bidsync.backend.config;

import com.bidsync.backend.domain.AuctionItem;
import com.bidsync.backend.domain.Bid;
import com.bidsync.backend.repository.AuctionItemRepository;
import com.bidsync.backend.repository.BidRepository;
import java.math.BigDecimal;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("local")
public class SampleDataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(SampleDataLoader.class);

    private final AuctionItemRepository itemRepository;
    private final BidRepository bidRepository;
    private final String imageBaseUrl;

    public SampleDataLoader(
            AuctionItemRepository itemRepository,
            BidRepository bidRepository,
            @Value("${bidsync.assets.base-url:/images/}") String imageBaseUrl
    ) {
        this.itemRepository = itemRepository;
        this.bidRepository = bidRepository;
        this.imageBaseUrl = imageBaseUrl.endsWith("/") ? imageBaseUrl : imageBaseUrl + "/";
    }

    @Override
    public void run(String... args) {
        bidRepository.deleteAll();
        itemRepository.deleteAll();
        log.info("Cleared existing auction items and bids before seeding sample data.");

        AuctionItem jacket = new AuctionItem(
                "Vintage USC Letterman Jacket",
                "Classic cardinal and gold jacket from the 1980s, complete with varsity patches and Trojans crest.",
                new BigDecimal("320.00"),
                imageUrl("vintage-letterman-jacket.webp")
        );
        jacket.addBid(new Bid(new BigDecimal("355.00"), "Casey T.", jacket));
        jacket.addBid(new Bid(new BigDecimal("389.00"), "Jordan K.", jacket));

        AuctionItem trumpet = new AuctionItem(
                "Spirit of Troy Alumni Trumpet",
                "Well-cared-for trumpet used by a Spirit of Troy alumnus, includes marching band music folder and cleaning kit.",
                new BigDecimal("260.00"),
                imageUrl("trumpet.webp")
        );
        trumpet.addBid(new Bid(new BigDecimal("295.00"), "Reese M.", trumpet));

        AuctionItem furniture = new AuctionItem(
                "USC Apartment Loft Desk",
                "Sturdy wooden loft desk from a Cardinal Gardens apartment, perfect for dorm study spaces.",
                new BigDecimal("120.00"),
                imageUrl("loft-desk.jpg")
        );
        furniture.addBid(new Bid(new BigDecimal("140.00"), "Avery L.", furniture));
        furniture.addBid(new Bid(new BigDecimal("158.00"), "Skylar D.", furniture));

        AuctionItem merchBundle = new AuctionItem(
                "Trojan Spirit Bundle",
                "Collection of pre-loved USC gear: Fight On flag, two game-day scarves, and a pair of pom-poms.",
                new BigDecimal("65.00"),
                imageUrl("trojan-spirit-bundle.png")
        );
        merchBundle.addBid(new Bid(new BigDecimal("79.00"), "Quinn H.", merchBundle));

        List<AuctionItem> items = List.of(jacket, trumpet, furniture, merchBundle);
        itemRepository.saveAll(items);
        log.info("Seeded {} sample auction items for local profile.", items.size());
    }

    private String imageUrl(String fileName) {
        return imageBaseUrl + fileName;
    }
}
