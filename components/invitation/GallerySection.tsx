"use client";

import Image from "next/image";
import {
  galleryImages,
  templateAssets,
  templateContent,
} from "@/data/template-content";
import { t, type Language } from "@/data/translations";
import { Reveal } from "./Reveal";

/**
 * The arch-topped garden frame. Renders nothing at all when no gallery image
 * ships with the deployment.
 */
export function GallerySection({ language }: { language: Language }) {
  if (galleryImages.length === 0) return null;

  return (
    <section className="section section--warm" aria-labelledby="gallery-heading">
      <div className="shell stack-center">
        <Reveal className="stack-center">
          <h2 id="gallery-heading" className="heading">
            {t(templateContent.gallery.heading, language)}
          </h2>

          {galleryImages.map((image) => (
            <figure
              className="gallery__frame"
              key={image.src}
              style={{ marginTop: "clamp(1.2rem, 5vw, 1.8rem)" }}
            >
              <Image
                src={image.src}
                alt={t(image.alt, language)}
                width={image.width}
                height={image.height}
                sizes="(min-width: 64rem) 30rem, (min-width: 48rem) 26rem, 90vw"
              />
              <Image
                className="gallery__ornament"
                src={templateAssets.ornamentLight.src}
                alt=""
                width={templateAssets.ornamentLight.width}
                height={templateAssets.ornamentLight.height}
                sizes="(min-width: 64rem) 30rem, 90vw"
              />
            </figure>
          ))}

          <p className="gallery__quote">
            {t(templateContent.gallery.quote, language)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
