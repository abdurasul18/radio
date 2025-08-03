<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
const props = defineProps<{
  lat: number | null;
  lon: number | null;
  viewMode ?: boolean
}>();

const emits = defineEmits<{
  (e: "update:lat", value: number | null): void;
  (e: "update:lon", value: number | null): void;
}>();

// Default qiymatlar
const zoom = ref(6);
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = "&copy; OpenStreetMap contributors";

// center har doim lat/lon bo'yicha aniqlanadi
const center = computed(() => {
  if (props.lat !== null && props.lon !== null) {
    return [props.lat, props.lon];
  }
  return [41.3111, 69.2797]; // Tashkent default
});

// click paytida koordinatalarni yangilash
function onMapClick(e: any) {
  const { lat, lng } = e.latlng;
  emits("update:lat", lat);
  emits("update:lon", lng);
}
//
// Joriy joylashuvni olish
function setCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Brauzeringiz geolokatsiyani qo‘llab-quvvatlamaydi.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      emits("update:lat", position.coords.latitude);
      emits("update:lon", position.coords.longitude);
    },
    (error) => {
      alert("Joylashuvni aniqlab bo‘lmadi: " + error.message);
    }
  );
}
function clearLocation() {
  emits("update:lat", null);
  emits("update:lon", null);
}
</script>
<template>
  <div class="map-container">
    <LMap
      :zoom="zoom"
      :center="center"
      style="height: 400px; width: 100%"
      @click="onMapClick"
    >
      <LTileLayer :url="tileUrl" :attribution="attribution" />
      <LMarker v-if="lat !== null && lon !== null" :lat-lng="[lat, lon]" />
    </LMap>

    <div v-if="lat === null || lon === null" class="overlay-text">
      Joylashuvni tanlang
    </div>
    <div class="flex justify-end mt-2 gap-2" v-if="!viewMode">
      <CButton size="small" ghost  @click="setCurrentLocation"
        >📍 Joriy joylashuv</CButton
      >
      <CButton
      ghost
        size="small"
        type="error"
        @click="clearLocation"
        v-if="lat !== null && lon !== null"
        >❌ Tozalash</CButton
      >
    </div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
}
.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  pointer-events: none;
}
</style>
