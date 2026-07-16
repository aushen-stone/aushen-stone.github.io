"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { PREFERRED_APPLICATION_FILTER_OPTIONS } from "@/data/productFilterOptions";
import { slugifyCmsValue } from "@/lib/cmsContent";
import {
  formatSurfaceFinishLabel,
  resolveFinishSpecification,
} from "@/lib/productSpecifications";
import type {
  ApplicationFinishOffer,
  ApplicationIndexEntry,
  Size,
} from "@/types/product";

type ProductSpecificationsEditorProps = {
  value: ApplicationIndexEntry[];
  onChange: (value: ApplicationIndexEntry[]) => void;
};

const newId = (prefix: string) =>
  `${prefix}-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;

const newSize = (): Size => ({ raw: "", unit: "mm" });
const newFinish = (): ApplicationFinishOffer => ({
  id: newId("finish"),
  name: "",
  sizes: [newSize()],
});
const newApplication = (): ApplicationIndexEntry => {
  const first = PREFERRED_APPLICATION_FILTER_OPTIONS[0];
  return {
    id: newId("application"),
    label: first.name,
    category: first.name,
    categorySlug: first.slug,
    finishes: [newFinish()],
  };
};

export default function ProductSpecificationsEditor({
  value,
  onChange,
}: ProductSpecificationsEditorProps) {
  const updateApplication = (
    applicationIndex: number,
    update: (application: ApplicationIndexEntry) => ApplicationIndexEntry,
  ) =>
    onChange(
      value.map((application, index) =>
        index === applicationIndex ? update(application) : application,
      ),
    );

  const updateFinish = (
    applicationIndex: number,
    finishIndex: number,
    update: (finish: ApplicationFinishOffer) => ApplicationFinishOffer,
  ) =>
    updateApplication(applicationIndex, (application) => ({
      ...application,
      finishes: application.finishes.map((finish, index) =>
        index === finishIndex ? update(finish) : finish,
      ),
    }));

  return (
    <section className="border border-[#D8D2C8] bg-[#F8F5F1] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl">Product specifications</h3>
          <p className="mt-1 text-xs leading-5 text-gray-600">
            Applications drive catalogue filters. Finishes and sizes drive the product selector and availability enquiry.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange([...value, newApplication()])}
          className="inline-flex shrink-0 items-center gap-2 border border-[#283020] bg-white px-3 py-2 text-xs uppercase tracking-[0.1em]"
        >
          <Plus size={14} /> Application
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {value.length === 0 ? (
          <p className="border border-dashed border-[#C9C1B6] bg-white p-4 text-sm text-gray-600">
            No specifications yet. Add an application to begin.
          </p>
        ) : null}
        {value.map((application, applicationIndex) => (
          <article key={application.id} className="border border-[#D8D2C8] bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Application name">
                <input
                  required
                  value={application.label}
                  onChange={(event) =>
                    updateApplication(applicationIndex, (current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  className="admin-input"
                />
              </Field>
              <Field label="Product filter category">
                <select
                  value={application.categorySlug}
                  onChange={(event) => {
                    const option = PREFERRED_APPLICATION_FILTER_OPTIONS.find(
                      ({ slug }) => slug === event.target.value,
                    );
                    if (!option) return;
                    updateApplication(applicationIndex, (current) => ({
                      ...current,
                      category: option.name,
                      categorySlug: option.slug,
                    }));
                  }}
                  className="admin-input"
                >
                  {PREFERRED_APPLICATION_FILTER_OPTIONS.map((option) => (
                    <option key={option.slug} value={option.slug}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => onChange(value.filter((_, index) => index !== applicationIndex))}
                className="inline-flex items-center gap-2 text-xs text-red-700"
              >
                <Trash2 size={14} /> Remove application
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {application.finishes.map((finish, finishIndex) => (
                <div key={finish.id} className="border-l-2 border-[#8B947C] bg-[#F8F5F1] p-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Surface finish">
                      <input
                        required
                        value={finish.name}
                        onChange={(event) =>
                          updateFinish(applicationIndex, finishIndex, (current) => ({
                            ...current,
                            name: event.target.value,
                            id: current.id || slugifyCmsValue(event.target.value),
                          }))
                        }
                        onBlur={() =>
                          updateFinish(applicationIndex, finishIndex, (current) => {
                            const resolved = resolveFinishSpecification(current);
                            return {
                              ...current,
                              name: resolved.name === "-" ? "" : resolved.name,
                              slipRating:
                                resolved.slipRating === "-"
                                  ? undefined
                                  : resolved.slipRating,
                            };
                          })
                        }
                        className="admin-input"
                        placeholder="e.g. Sandblasted or Sandblasted (P5)"
                      />
                    </Field>
                    <Field label="Slip rating (optional)">
                      <input
                        value={finish.slipRating ?? ""}
                        onChange={(event) =>
                          updateFinish(applicationIndex, finishIndex, (current) => ({
                            ...current,
                            slipRating: event.target.value || undefined,
                          }))
                        }
                        className="admin-input"
                        placeholder="e.g. P5"
                      />
                    </Field>
                  </div>

                  {finish.name.trim() ? (
                    <p className="mt-2 text-xs text-gray-500">
                      Customer-facing value: {formatSurfaceFinishLabel(finish)}
                    </p>
                  ) : null}

                  <div className="mt-3">
                    <div className="text-xs uppercase tracking-[0.1em] text-gray-500">Sizes</div>
                    <div className="mt-2 space-y-2">
                      {finish.sizes.map((size, sizeIndex) => (
                        <div key={`${finish.id}-size-${sizeIndex}`} className="flex gap-2">
                          <input
                            required
                            value={size.raw}
                            onChange={(event) =>
                              updateFinish(applicationIndex, finishIndex, (current) => ({
                                ...current,
                                sizes: current.sizes.map((item, index) =>
                                  index === sizeIndex
                                    ? { ...item, raw: event.target.value, unit: "mm" }
                                    : item,
                                ),
                              }))
                            }
                            className="admin-input"
                            placeholder="e.g. 600x400x20mm"
                          />
                          <button
                            type="button"
                            aria-label={`Remove size ${sizeIndex + 1}`}
                            onClick={() =>
                              updateFinish(applicationIndex, finishIndex, (current) => ({
                                ...current,
                                sizes: current.sizes.filter((_, index) => index !== sizeIndex),
                              }))
                            }
                            className="border border-red-200 px-3 text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateFinish(applicationIndex, finishIndex, (current) => ({
                          ...current,
                          sizes: [...current.sizes, newSize()],
                        }))
                      }
                      className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-[0.08em]"
                    >
                      <Plus size={13} /> Size
                    </button>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        updateApplication(applicationIndex, (current) => ({
                          ...current,
                          finishes: current.finishes.filter((_, index) => index !== finishIndex),
                        }))
                      }
                      className="inline-flex items-center gap-2 text-xs text-red-700"
                    >
                      <Trash2 size={14} /> Remove finish
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  updateApplication(applicationIndex, (current) => ({
                    ...current,
                    finishes: [...current.finishes, newFinish()],
                  }))
                }
                className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.08em]"
              >
                <Plus size={13} /> Surface finish
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-gray-500">{label}</span>
      {children}
    </label>
  );
}
