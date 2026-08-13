import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SmartLink } from "@/components/ui/smart-link";
import { getVisibleVersions } from "@/lib/versions";

export const metadata: Metadata = {
  title: "Версии главной страницы",
  description: "Выбор версии главной страницы для сравнения.",
  robots: { index: false, follow: false },
};

/**
 * Хаб: список версий главной с описанием и кнопкой «Смотреть».
 * Содержимое собирается из `lib/versions.ts` — руками здесь ничего не правится.
 */
export default function VersionsHubPage() {
  const versions = getVisibleVersions();

  return (
    <main className="min-h-screen bg-background py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-[760px]">
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-subtle">
            ONÁ
          </p>
          <h1 className="mt-3 font-heading text-[34px] leading-tight text-foreground sm:text-[44px]">
            Версии главной страницы
          </h1>
          <p className="mt-4 text-[16px] leading-[1.6] text-text-deep sm:text-[17px]">
            Ниже — варианты оформления главной страницы. Контент во всех версиях одинаковый,
            отличается подача. Откройте любую и сравните.
          </p>

          <ul className="mt-10 space-y-4 lg:mt-12">
            {versions.map((version) => (
              <li
                key={version.id}
                className="rounded-[24px] border border-subtle-border bg-on-primary p-6 transition-colors duration-300 hover:border-primary sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                  <div className="min-w-0">
                    <h2 className="font-heading text-[24px] leading-tight text-foreground sm:text-[27px]">
                      {version.title}
                      {version.status === "draft" && (
                        <span className="ml-3 align-middle text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">
                          черновик
                        </span>
                      )}
                    </h2>
                    <p className="mt-2 text-[15px] leading-[1.55] text-text-deep">
                      {version.description}
                    </p>
                  </div>

                  <SmartLink
                    href={`/versions/${version.id}`}
                    className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-primary px-8 text-[13px] font-semibold tracking-[0.02em] text-on-primary transition-colors duration-300 hover:bg-primary-dark"
                  >
                    Смотреть
                  </SmartLink>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
}
