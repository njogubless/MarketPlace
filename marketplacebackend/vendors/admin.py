from django.contrib import admin



from django.contrib import admin
from .models import Vendor, VendorStats

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display  = ['shop_name', 'handle', 'location', 'is_verified', 'created_at']
    list_filter   = ['is_verified']
    search_fields = ['shop_name', 'handle', 'location']
    prepopulated_fields = {'handle': ('shop_name',)}  # auto-fills slug from name

@admin.register(VendorStats)
class VendorStatsAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'total_sales', 'total_revenue', 'avg_rating', 'total_reviews']
    readonly_fields = ['vendor']  # stats shouldn't be reassigned to a different vendor