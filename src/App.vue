<script setup lang="ts">
import { NConfigProvider, GlobalThemeOverrides } from "naive-ui";
import { LangService } from "./services/lang";
import { i18n } from "./plugins/i18n";
const { locale } = useI18n();
import { ruRU, dateRuRU, NLocale, NDateLocale, dateTrTR } from "naive-ui";
import { uzLt } from "/@src/locales/naive/uzLt";
import { uzCr } from "/@src/locales/naive/uzCr";
const themeOverrides: GlobalThemeOverrides = {
  common: {
    infoColor: "#00AAFF",
    errorColor: "#FF2727",
  },
};

const { messages, t } = useI18n();
let currentLocale = locale.value as "uz" | "ru" | "lt" | "en";


//
let currentNaiveLocale = computed<{
  locale: NLocale | null;
  dateLocale: NDateLocale | null;
}>(() => {
  if (currentLocale == "ru") {
    return {
      locale: ruRU,
      dateLocale: dateRuRU,
      firstDayOfWeek:0,

    };
  } else if (currentLocale == "lt") {
    return {
      locale: uzLt,
      dateLocale: dateRuRU,
      firstDayOfWeek:0,

    };
  } else if (currentLocale == "uz") {
    return {
      locale: uzCr,
      dateLocale: dateRuRU,
      firstDayOfWeek:0,
    };
  } else {
    return {
      locale: null,
      dateLocale: null,
    };
  }
});
// change translation

</script>

<template>
  <n-config-provider
    :themeOverrides="themeOverrides"
    :locale="currentNaiveLocale?.locale"
    :date-locale="currentNaiveLocale?.dateLocale"
  >
    <n-modal-provider>
      <n-dialog-provider>
        <n-notification-provider placement="bottom-right">
          <Transition>
            <RouterView />
          </Transition>
        </n-notification-provider>
      </n-dialog-provider>
    </n-modal-provider>
  </n-config-provider>
</template>
