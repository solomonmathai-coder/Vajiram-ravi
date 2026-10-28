import Image from "next/image";
import { Fragment } from "react";
import { TinyArrowIcon } from "@/components/icons";
import { NUDGE } from "@/components/ui/Buttons";
import { Eyebrow, Lead, SectionTitle } from "@/components/ui/Typography";
import { contactOptions, type ContactOption } from "@/data/home";
import { cx } from "@/lib/cx";

function OptionIcon({ option }: { option: ContactOption }) {
  const Icon = option.icon;
  return (
    <span className="flex size-8 shrink-0 items-center justify-center">
      {option.image ? (
        <Image src={option.image.src} alt={option.image.alt} width={32} height={32} />
      ) : (
        Icon && <Icon />
      )}
    </span>
  );
}

export default function ContactOptions() {
  return (
    <section className="bg-brand-50" aria-labelledby="op-h">
      <div className="relative mx-auto flex w-canvas flex-col items-center gap-12 px-20 py-24">
        <div data-reveal className="flex w-full flex-col items-center gap-5">
          <Eyebrow>CONTACT US</Eyebrow>
          <div className="flex w-full flex-col items-center gap-3 text-center">
            <SectionTitle id="op-h" className="w-full">
              What are you looking for?
            </SectionTitle>
            <Lead className="w-[838px]">We’re here to help you anytime, any way</Lead>
          </div>
        </div>
        <div data-reveal-group className="grid h-[306px] w-full grid-cols-4 gap-4">
          {contactOptions.map((option) => (
            <a
              key={option.title}
              href={option.href}
              className="group/card flex flex-col gap-6 overflow-hidden rounded-[20px] border border-line bg-white p-6 [transition:translate_.35s_var(--ease-smooth),box-shadow_.35s_var(--ease-smooth),border-color_.3s] hover:-translate-y-1 hover:border-neutral-300 hover:shadow-[0_20px_36px_-20px_rgba(43,20,5,.3)]"
            >
              <OptionIcon option={option} />
              <div className="flex min-h-0 flex-1 flex-col gap-3">
                <h3 className="font-display text-[20px]/[27px] font-semibold text-neutral-900">{option.title}</h3>
                <p className="font-sans text-[16px]/[23px] font-medium text-neutral-500">
                  {option.lines.map((line, i) => (
                    <Fragment key={line}>
                      {i > 0 && <br />}
                      {line}
                    </Fragment>
                  ))}
                </p>
              </div>
              <div className="h-px bg-line" />
              <span className="font-display text-[16px]/[22px] font-semibold whitespace-pre text-brand-700">
                {option.cta}
                <TinyArrowIcon className={cx(NUDGE, "ml-[10.5px] inline-block align-[1px] group-hover/card:translate-x-1")} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
