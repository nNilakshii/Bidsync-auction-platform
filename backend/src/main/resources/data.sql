INSERT INTO auction_item (title, description, starting_price, created_at)
VALUES
    ('Vintage Camera', 'Iconic 35mm film camera with manual controls.', 120.00, NOW()),
    ('Signed Vinyl', 'Limited edition vinyl signed by the artist.', 80.00, NOW())
ON CONFLICT DO NOTHING;
