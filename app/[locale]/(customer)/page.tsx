import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomePage, HomePageMessages } from "@/components/home/HomePage";
import { Locale } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

async function getHomePageMessages(locale: Locale): Promise<HomePageMessages> {
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    brand: t("brand"),
    navigation: {
      menu: t("navigation.menu"),
      visit: t("navigation.visit"),
      about: t("navigation.about"),
    },
    actions: {
      orderAhead: t("actions.orderAhead"),
      viewMenu: t("actions.viewMenu"),
      planVisit: t("actions.planVisit"),
    },
    hero: {
      eyebrow: t("hero.eyebrow"),
      title: t("hero.title"),
      description: t("hero.description"),
    },
    details: {
      eyebrow: t("details.eyebrow"),
      title: t("details.title"),
      menu: {
        label: t("details.menu.label"),
        value: t("details.menu.value"),
      },
      visit: {
        label: t("details.visit.label"),
        value: t("details.visit.value"),
      },
      about: {
        label: t("details.about.label"),
        value: t("details.about.value"),
      },
    },
    mediaAlt: t("mediaAlt"),
    language: {
      norwegian: t("language.norwegian"),
      english: t("language.english"),
    },
  };
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage.metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        no: "/no",
        en: "/en",
        "x-default": "/no",
      },
    },
  };
}

export default async function Page({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <HomePage
      currentPath={`/${locale}`}
      locale={locale}
      messages={await getHomePageMessages(locale)}
    />
  );
}
