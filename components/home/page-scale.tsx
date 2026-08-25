"use client";

import { useLayoutEffect } from "react";

/**
 * Ставит `data-ona-scale="<scale>"` на `<html>` — включает облегчённый масштаб
 * типографики/отступов главной (см. `app/globals.css`, блок «Облегчённые
 * версии», и `docs/redesign/lightweight-scale-plan.md`).
 *
 * Тот же приём, что у `force-motion.tsx`: `<html>` рендерится в общем
 * `app/layout.tsx`, страница версии не может добавить ему атрибут из
 * серверного компонента, поэтому делаем это в рантайме и убираем при уходе
 * со страницы, чтобы масштаб не «протёк» на следующий роут при клиентской
 * навигации.
 *
 * `useLayoutEffect`, а не `useEffect` — принципиально. `FaqSection` меряет
 * `scrollHeight` ответа в СВОЁМ `useLayoutEffect`, чтобы анимировать высоту
 * аккордеона. React выполняет ВСЕ layout-эффекты дерева раньше любых обычных
 * эффектов — если бы этот компонент ставил атрибут в `useEffect`, FAQ успевал
 * бы измерить высоту ДО того, как применились уменьшенные кегли, и запоминал
 * старую (макетную) высоту: открытый ответ занимал бы больше места, чем
 * реально нужно уменьшенному тексту — «текст прилипает к верху» пустой
 * нижней части блока. `PageScale` рендерится раньше `FaqSection` по дереву
 * (см. `home-light.tsx`), поэтому его layout-эффект успевает первым.
 */
export function PageScale({ scale }: { scale: string }) {
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-ona-scale", scale);
    return () => {
      document.documentElement.removeAttribute("data-ona-scale");
    };
  }, [scale]);

  return null;
}
