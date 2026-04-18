"""
products/management/commands/seed_data.py

LESSON: Management commands
Run with: python manage.py seed_data
Run with wipe: python manage.py seed_data --clear

This command creates realistic test data so your API endpoints
return real data when you hit them from the frontend.

LESSON: get_or_create(slug=..., defaults={...})
- Looks for a row WHERE slug = 'laptops'
- If found  → returns (obj, False) — does NOT update it
- If missing → creates it with ALL the defaults fields
This makes the command safe to run multiple times — no duplicates.
"""

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Seed the database with sample categories, vendors, and products'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Delete all existing products, categories and vendors before seeding',
        )

    def handle(self, *args, **options):
        # ── Import models inside handle() ──────────────────────────────────
        # LESSON: Why import here and not at the top?
        # Management commands are loaded before Django's app registry is ready.
        # Importing models at module level can cause "Apps not ready" errors.
        # Importing inside handle() guarantees the registry is fully loaded.
        from products.models import Category, Product
        from vendors.models import Vendor, VendorStats
        from django.contrib.auth import get_user_model
        User = get_user_model()

        if options['clear']:
            self.stdout.write(self.style.WARNING('  Clearing products, categories, vendor stats...'))
            Product.objects.all().delete()
            Category.objects.all().delete()
            VendorStats.objects.all().delete()
            Vendor.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()
            self.stdout.write(self.style.WARNING('  Cleared.\n'))

        self.stdout.write('🌱 Seeding database...\n')

        categories = self._seed_categories()
        vendors    = self._seed_vendors(User, Vendor, VendorStats)
        self._seed_products(categories, vendors, Product)

        self.stdout.write(self.style.SUCCESS(
            '\n✅  Seeding complete!'
            '\n   → http://127.0.0.1:8000/api/products/'
            '\n   → http://127.0.0.1:8000/api/vendors/'
            '\n   → http://127.0.0.1:8000/api/products/categories/'
            '\n   → http://127.0.0.1:8000/admin/'
        ))

    # ── helpers ────────────────────────────────────────────────────────────

    def _seed_categories(self):
        from products.models import Category

        CATS = [
            {'name': 'Laptops & PCs',      'slug': 'laptops',    'icon': 'fa-laptop',        'description': 'Laptops, desktops and workstations'},
            {'name': 'Phones & Tablets',    'slug': 'phones',     'icon': 'fa-mobile-screen', 'description': 'Smartphones, tablets and accessories'},
            {'name': 'Audio & Headphones',  'slug': 'audio',      'icon': 'fa-headphones',    'description': 'Headphones, speakers and audio interfaces'},
            {'name': 'Gaming',              'slug': 'gaming',     'icon': 'fa-gamepad',       'description': 'Consoles, games and gaming peripherals'},
            {'name': 'Software & Licenses', 'slug': 'software',   'icon': 'fa-code',          'description': 'Software licenses and developer tools'},
            {'name': 'Cameras & Drones',    'slug': 'cameras',    'icon': 'fa-camera',        'description': 'Cameras, drones and imaging gear'},
            {'name': 'Wearables',           'slug': 'wearables',  'icon': 'fa-watch',         'description': 'Smartwatches, fitness bands and AR glasses'},
            {'name': 'PC Components',       'slug': 'components', 'icon': 'fa-microchip',     'description': 'GPUs, CPUs, RAM and storage'},
            {'name': 'Networking',          'slug': 'networking', 'icon': 'fa-wifi',          'description': 'Routers, switches and network gear'},
            {'name': 'Smart Home',          'slug': 'smarthome',  'icon': 'fa-house',         'description': 'Smart speakers and home automation'},
        ]

        created = []
        for data in CATS:
            obj, was_created = Category.objects.get_or_create(
                slug=data['slug'],
                defaults=data,
            )
            created.append(obj)
            mark = '✓' if was_created else '→'
            self.stdout.write(f'  {mark} Category: {obj.name}')

        self.stdout.write(f'\n  {len(created)} categories ready.\n')
        return {c.slug: c for c in created}   # return as dict for easy lookup

    def _seed_vendors(self, User, Vendor, VendorStats):
        """
        Creates a user account (role=vendor) and a Vendor profile for each.
        Uses your actual Vendor fields: shop_name, handle, description,
        location, is_verified.
        """
        VENDOR_DATA = [
            {
                'email': 'nova@techvault.com', 'full_name': 'Nova Electronics',
                'shop_name': 'NovaElectronics', 'handle': 'novaelectronics',
                'description': 'Premium electronics retailer — laptops, GPUs and workstations. Full manufacturer warranty on all products.',
                'location': 'San Francisco, USA', 'is_verified': True,
                'stats': {'total_sales': 8420, 'avg_rating': 4.97, 'total_reviews': 3241},
            },
            {
                'email': 'pixel@techvault.com', 'full_name': 'Pixel Forge',
                'shop_name': 'PixelForge', 'handle': 'pixelforge',
                'description': 'Software licenses and developer tools. Instant digital delivery on all purchases.',
                'location': 'London, UK', 'is_verified': True,
                'stats': {'total_sales': 5130, 'avg_rating': 4.95, 'total_reviews': 1872},
            },
            {
                'email': 'sound@techvault.com', 'full_name': 'Sound Lab',
                'shop_name': 'SoundLab', 'handle': 'soundlab',
                'description': 'Top-rated audio specialist. Every product tested by our in-house audio engineers before shipping.',
                'location': 'Berlin, Germany', 'is_verified': True,
                'stats': {'total_sales': 6890, 'avg_rating': 4.92, 'total_reviews': 2647},
            },
            {
                'email': 'gamecore@techvault.com', 'full_name': 'Game Core',
                'shop_name': 'GameCore', 'handle': 'gamecore',
                'description': 'Direct import of gaming hardware and accessories from Japan. Exclusive limited editions.',
                'location': 'Tokyo, Japan', 'is_verified': True,
                'stats': {'total_sales': 11200, 'avg_rating': 4.89, 'total_reviews': 4210},
            },
            {
                'email': 'drone@techvault.com', 'full_name': 'Drone Works',
                'shop_name': 'DroneWorks', 'handle': 'droneworks',
                'description': 'Cameras, drones and imaging equipment for professionals. Ships with full documentation.',
                'location': 'Toronto, Canada', 'is_verified': True,
                'stats': {'total_sales': 2340, 'avg_rating': 4.94, 'total_reviews': 981},
            },
            {
                'email': 'wear@techvault.com', 'full_name': 'Wear Tech',
                'shop_name': 'WearTech', 'handle': 'weartech',
                'description': 'Smartwatches, fitness trackers and AR glasses. Sourced directly from manufacturers.',
                'location': 'Sydney, Australia', 'is_verified': False,
                'stats': {'total_sales': 3870, 'avg_rating': 4.88, 'total_reviews': 1540},
            },
        ]

        vendors = []
        for data in VENDOR_DATA:
            # 1. Create the user account
            user, u_created = User.objects.get_or_create(
                email=data['email'],
               defaults={
    'username': data['email'],  # REQUIRED for AbstractUser
    'email': data['email'],
    'first_name': data['full_name'].split()[0],
    'last_name': ' '.join(data['full_name'].split()[1:]) or '',
    'is_vendor': True,
}
            )
            if u_created:
                user.set_password('vendor123!')
                user.save()

            # 2. Create the Vendor profile — matched to YOUR Vendor model fields
            vendor, v_created = Vendor.objects.get_or_create(
                user=user,
                defaults={
                    'shop_name':   data['shop_name'],
                    'handle':      data['handle'],
                    'description': data['description'],
                    'location':    data['location'],
                    'is_verified': data['is_verified'],
                }
            )

            # 3. Create VendorStats
            VendorStats.objects.get_or_create(
                vendor=vendor,
                defaults=data['stats'],
            )

            vendors.append(vendor)
            mark = '✓' if v_created else '→'
            self.stdout.write(f'  {mark} Vendor: {vendor.shop_name}')

        self.stdout.write(f'\n  {len(vendors)} vendors ready.\n')
        return vendors

    def _seed_products(self, categories, vendors, Product):
        """
        Creates products matched to your Product model fields.
        vendor_idx maps to the vendors list (0=Nova, 1=Pixel, 2=Sound, etc.)
        """
        # Make sure required category slugs exist — use 'laptops' as fallback
        def cat(slug):
            return categories.get(slug, categories.get('laptops'))

        PRODUCTS = [
            # ── Laptops ───────────────────────────────────────────────────
            {
                'name': 'ASUS ProArt Studiobook 16 OLED',
                'slug': 'asus-proart-studiobook-16-oled',
                'description': 'OLED workstation laptop for creators and developers. RTX 4070, Ryzen 9, and Pantone-validated display perfect for color-critical work.',
                'price': Decimal('1899.00'), 'old_price': Decimal('2199.00'),
                'category_slug': 'laptops', 'vendor_idx': 0,
                'stock': 15, 'is_featured': True,
                'specs': {'Display': '16" 4K OLED 120Hz', 'CPU': 'AMD Ryzen 9 7945HX', 'GPU': 'RTX 4070 8GB', 'RAM': '32GB DDR5', 'Storage': '1TB NVMe SSD'},
            },
            {
                'name': 'MacBook Pro 16 M4 Max',
                'slug': 'macbook-pro-16-m4-max',
                'description': 'Apple M4 Max chip with 14-core CPU and 32-core GPU. Up to 128GB unified memory. The most powerful MacBook Pro ever made.',
                'price': Decimal('3499.00'), 'old_price': None,
                'category_slug': 'laptops', 'vendor_idx': 0,
                'stock': 8, 'is_featured': True,
                'specs': {'Chip': 'Apple M4 Max', 'CPU': '14-core', 'GPU': '32-core', 'RAM': '64GB Unified', 'Storage': '2TB SSD'},
            },
            {
                'name': 'ThinkPad X1 Carbon Gen 12',
                'slug': 'thinkpad-x1-carbon-gen-12',
                'description': 'Ultra-lightweight business laptop. 14" display, Intel Core Ultra 7, all-day battery. The gold standard for enterprise mobility.',
                'price': Decimal('1649.00'), 'old_price': Decimal('1849.00'),
                'category_slug': 'laptops', 'vendor_idx': 0,
                'stock': 22, 'is_featured': False,
                'specs': {'Display': '14" IPS 2.8K', 'CPU': 'Intel Core Ultra 7', 'RAM': '32GB LPDDR5', 'Storage': '1TB SSD', 'Weight': '1.12kg'},
            },
            # ── Audio ─────────────────────────────────────────────────────
            {
                'name': 'Sony WH-1000XM6 Wireless',
                'slug': 'sony-wh-1000xm6',
                'description': 'Industry-leading noise cancellation with 40-hour battery. Multipoint connect to 2 devices. Speak-to-chat pauses music automatically.',
                'price': Decimal('379.00'), 'old_price': Decimal('429.00'),
                'category_slug': 'audio', 'vendor_idx': 2,
                'stock': 45, 'is_featured': True,
                'specs': {'Driver': '30mm dynamic', 'ANC': 'Industry-leading', 'Battery': '40 hours', 'Bluetooth': '5.3', 'Weight': '250g'},
            },
            {
                'name': 'Focusrite Scarlett 4i4 4th Gen',
                'slug': 'focusrite-scarlett-4i4',
                'description': 'Studio-grade USB audio interface. 4 ins, 4 outs. Air mode adds vintage preamp character. Essential for home studio recording.',
                'price': Decimal('219.00'), 'old_price': Decimal('249.00'),
                'category_slug': 'audio', 'vendor_idx': 2,
                'stock': 30, 'is_featured': False,
                'specs': {'Inputs': '4 (2 XLR/TRS combo)', 'Outputs': '4', 'Sample Rate': '192kHz/24-bit', 'Connection': 'USB-C'},
            },
            {
                'name': 'Apple AirPods Pro 3',
                'slug': 'apple-airpods-pro-3',
                'description': 'Next-generation ANC with Hearing Aid feature. H3 chip, 35-hour total battery with case. USB-C charging.',
                'price': Decimal('289.00'), 'old_price': None,
                'category_slug': 'audio', 'vendor_idx': 2,
                'stock': 60, 'is_featured': False,
                'specs': {'Chip': 'Apple H3', 'ANC': 'Adaptive Transparency', 'Battery': '8h + 35h case', 'Connection': 'USB-C'},
            },
            # ── Gaming ────────────────────────────────────────────────────
            {
                'name': 'Sony PlayStation 5 Pro Bundle',
                'slug': 'sony-ps5-pro-bundle',
                'description': 'PS5 Pro with DualSense controller, 2 games, and 1-year PS Plus. Japan import with full English support.',
                'price': Decimal('649.00'), 'old_price': None,
                'category_slug': 'gaming', 'vendor_idx': 3,
                'stock': 12, 'is_featured': True,
                'specs': {'Processor': 'AMD Zen 2 + RDNA 2', 'Storage': '825GB SSD', 'Resolution': 'Up to 8K', 'Frame Rate': 'Up to 120fps'},
            },
            {
                'name': 'ASUS ROG Ally X Gaming Handheld',
                'slug': 'asus-rog-ally-x',
                'description': 'Windows handheld gaming PC. AMD Ryzen Z1 Extreme, 7" 120Hz display, 1TB storage. Play your entire PC library anywhere.',
                'price': Decimal('799.00'), 'old_price': Decimal('899.00'),
                'category_slug': 'gaming', 'vendor_idx': 3,
                'stock': 20, 'is_featured': True,
                'specs': {'CPU': 'AMD Ryzen Z1 Extreme', 'Display': '7" FHD 120Hz', 'RAM': '24GB LPDDR5', 'Storage': '1TB SSD', 'Battery': '80Wh'},
            },
            {
                'name': 'Logitech G Pro X Superlight 3',
                'slug': 'logitech-g-pro-x-superlight-3',
                'description': 'Ultra-lightweight wireless gaming mouse at 54g. HERO 2 sensor, 95-hour battery. Used by professional esports players worldwide.',
                'price': Decimal('179.00'), 'old_price': Decimal('199.00'),
                'category_slug': 'gaming', 'vendor_idx': 3,
                'stock': 80, 'is_featured': False,
                'specs': {'Weight': '54g', 'Sensor': 'HERO 2 25K DPI', 'Battery': '95 hours', 'Connection': 'LIGHTSPEED Wireless'},
            },
            # ── Software ──────────────────────────────────────────────────
            {
                'name': 'JetBrains All Products Pack',
                'slug': 'jetbrains-all-products-pack',
                'description': '1-year license for all 12 JetBrains IDEs — IntelliJ IDEA, WebStorm, PyCharm, DataGrip and more. Instant email delivery.',
                'price': Decimal('249.00'), 'old_price': Decimal('329.00'),
                'category_slug': 'software', 'vendor_idx': 1,
                'stock': 999, 'is_featured': False,
                'specs': {'License': '1-year individual', 'Products': '12 IDEs included', 'Delivery': 'Instant (email)', 'Platforms': 'Win / Mac / Linux'},
            },
            {
                'name': 'Adobe Creative Cloud 1 Year',
                'slug': 'adobe-creative-cloud-1-year',
                'description': 'Full Creative Cloud subscription — Photoshop, Premiere, After Effects, Illustrator and 20+ more apps. 1TB cloud storage included.',
                'price': Decimal('599.00'), 'old_price': Decimal('659.00'),
                'category_slug': 'software', 'vendor_idx': 1,
                'stock': 999, 'is_featured': False,
                'specs': {'Apps': '20+ Creative apps', 'Storage': '1TB cloud', 'Devices': 'Up to 2', 'Delivery': 'Instant (email)'},
            },
            # ── Cameras ───────────────────────────────────────────────────
            {
                'name': 'DJI Mavic 4 Pro Fly More Combo',
                'slug': 'dji-mavic-4-pro-fly-more',
                'description': 'Triple-camera drone with 1" CMOS Hasselblad sensor. 46-minute flight time, omnidirectional obstacle avoidance. Fly More kit included.',
                'price': Decimal('2199.00'), 'old_price': None,
                'category_slug': 'cameras', 'vendor_idx': 4,
                'stock': 7, 'is_featured': True,
                'specs': {'Sensor': '1" CMOS Hasselblad', 'Video': '6K/60fps ProRes', 'Flight Time': '46 minutes', 'Range': '20km transmission'},
            },
            {
                'name': 'Sony Alpha A7 V Mirrorless',
                'slug': 'sony-alpha-a7-v',
                'description': 'Full-frame 61MP sensor, 8-stop stabilization, 4K120 video. The ultimate hybrid camera for photographers and videographers.',
                'price': Decimal('3299.00'), 'old_price': None,
                'category_slug': 'cameras', 'vendor_idx': 4,
                'stock': 5, 'is_featured': False,
                'specs': {'Sensor': '61MP Full-Frame BSI', 'IBIS': '8-stop', 'Video': '4K120 / 8K30', 'AF Points': '759 phase-detect'},
            },
            # ── Wearables ─────────────────────────────────────────────────
            {
                'name': 'Apple Watch Ultra 3',
                'slug': 'apple-watch-ultra-3',
                'description': 'Titanium case, precision dual-frequency GPS, 72-hour battery. Built for endurance athletes and adventurers.',
                'price': Decimal('799.00'), 'old_price': Decimal('849.00'),
                'category_slug': 'wearables', 'vendor_idx': 5,
                'stock': 25, 'is_featured': False,
                'specs': {'Case': 'Titanium 49mm', 'GPS': 'L1+L5 dual-frequency', 'Battery': '72 hours', 'Water Resistance': '100m EN13319'},
            },
            {
                'name': 'Samsung Galaxy Ring',
                'slug': 'samsung-galaxy-ring',
                'description': 'Ultra-slim health tracking ring. Sleep, heart rate, SpO2 and activity tracking. 7-day battery, titanium build, no subscription.',
                'price': Decimal('399.00'), 'old_price': None,
                'category_slug': 'wearables', 'vendor_idx': 5,
                'stock': 40, 'is_featured': False,
                'specs': {'Battery': '7 days', 'Material': 'Titanium', 'Sensors': 'HR, SpO2, Temperature', 'App': 'Samsung Health'},
            },
            # ── PC Components ─────────────────────────────────────────────
            {
                'name': 'NVIDIA RTX 5090 Founders Edition',
                'slug': 'nvidia-rtx-5090-founders-edition',
                'description': 'Next-gen GPU with 24GB GDDR7. Blackwell architecture, AI-accelerated rendering, 5th-gen Tensor Cores. Limited availability.',
                'price': Decimal('1999.00'), 'old_price': None,
                'category_slug': 'components', 'vendor_idx': 0,
                'stock': 3, 'is_featured': True,
                'specs': {'Architecture': 'NVIDIA Blackwell', 'VRAM': '24GB GDDR7', 'TDP': '575W', 'Ports': '3x DisplayPort 2.1 + HDMI 2.1'},
            },
            {
                'name': 'AMD Ryzen 9 9950X',
                'slug': 'amd-ryzen-9-9950x',
                'description': '16-core, 32-thread desktop processor. 5.7GHz max boost, 170W TDP, Zen 5 architecture. The fastest desktop CPU AMD has ever made.',
                'price': Decimal('649.00'), 'old_price': Decimal('699.00'),
                'category_slug': 'components', 'vendor_idx': 0,
                'stock': 18, 'is_featured': False,
                'specs': {'Cores': '16 cores / 32 threads', 'Boost Clock': '5.7GHz', 'TDP': '170W', 'Architecture': 'Zen 5', 'Socket': 'AM5'},
            },
            {
                'name': 'Samsung 990 Pro 2TB NVMe SSD',
                'slug': 'samsung-990-pro-2tb',
                'description': 'PCIe 4.0 NVMe SSD with 7450MB/s read speeds. 2TB capacity, full-drive encryption, ideal for gaming and creative work.',
                'price': Decimal('179.00'), 'old_price': Decimal('219.00'),
                'category_slug': 'components', 'vendor_idx': 0,
                'stock': 50, 'is_featured': False,
                'specs': {'Capacity': '2TB', 'Interface': 'PCIe 4.0 NVMe', 'Read Speed': '7450 MB/s', 'Write Speed': '6900 MB/s', 'Warranty': '5 years'},
            },
            # ── Networking ────────────────────────────────────────────────
            {
                'name': 'ASUS RT-BE96U WiFi 7 Router',
                'slug': 'asus-rt-be96u-wifi7',
                'description': 'Tri-band WiFi 7 router with 19Gbps total throughput. 6GHz band support, multi-link operation, AI-powered QoS.',
                'price': Decimal('599.00'), 'old_price': None,
                'category_slug': 'networking', 'vendor_idx': 0,
                'stock': 14, 'is_featured': False,
                'specs': {'Standard': 'WiFi 7 (802.11be)', 'Throughput': '19 Gbps total', 'Bands': 'Tri-band (2.4+5+6GHz)', 'Ports': '10G WAN + 4x 2.5G LAN'},
            },
            # ── Phones ────────────────────────────────────────────────────
            {
                'name': 'iPhone 17 Pro Max 512GB',
                'slug': 'iphone-17-pro-max-512gb',
                'description': 'Apple A19 Pro chip, periscope telephoto camera, 6.9" Super Retina XDR display. Titanium design with satellite connectivity.',
                'price': Decimal('1299.00'), 'old_price': None,
                'category_slug': 'phones', 'vendor_idx': 0,
                'stock': 30, 'is_featured': True,
                'specs': {'Chip': 'Apple A19 Pro', 'Display': '6.9" LTPO OLED', 'Camera': '200MP periscope telephoto', 'Storage': '512GB', 'Battery': '5000mAh'},
            },
        ]

        created_count = 0
        for data in PRODUCTS:
            # Skip if we can't find the vendor
            vendor_idx = data.pop('vendor_idx')
            if vendor_idx >= len(vendors):
                continue

            vendor          = vendors[vendor_idx]
            category_slug   = data.pop('category_slug')
            category        = cat(category_slug)
            old_price       = data.pop('old_price')

            # LESSON: get_or_create with slug as the unique lookup key
            # If you run seed_data twice, products with the same slug are
            # found and returned — not duplicated.
            product, was_created = Product.objects.get_or_create(
                slug=data['slug'],
                defaults={
                    **data,
                    'seller':    vendor.user,
                    'category':  category,
                    'price_old': old_price,
                   
                }
            )

            if was_created:
                created_count += 1
                self.stdout.write(f'  ✓ Product: {product.name}')
            else:
                self.stdout.write(f'  → Exists:  {product.name}')

        self.stdout.write(f'\n  {created_count} new products created.\n')