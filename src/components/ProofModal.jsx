import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function ProofModal({ item, onClose }) {
  const { t } = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState(null)

  const proofs = item?.proofItems || []
  const images = proofs.filter((p) => p.type === "image")
  const links = proofs.filter((p) => p.type !== "image")

  // Réinitialise l'image agrandie quand on change d'activité ou ferme la modale
  useEffect(() => {
    setSelectedIndex(null)
  }, [item])

  useEffect(() => {
    if (!item) return

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        // Si une image est ouverte en grand, Échap la ferme d'abord
        if (selectedIndex !== null) {
          setSelectedIndex(null)
        } else {
          onClose()
        }
      } else if (selectedIndex !== null && images.length > 1) {
        if (e.key === "ArrowRight") {
          setSelectedIndex((prev) => (prev + 1) % images.length)
        } else if (e.key === "ArrowLeft") {
          setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [item, onClose, selectedIndex, images.length])

  if (!item) return null

  const activeImage = selectedIndex !== null ? images[selectedIndex] : null

  return (
    <>
      {/* MODALE PRINCIPALE */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      >
        <div
          className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* En-tête */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
            <h3 className="text-lg font-bold text-slate-900">{item.activite}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 text-2xl leading-none cursor-pointer"
            >
              &times;
            </button>
          </div>

          {/* Contenu */}
          <div className="p-6 flex flex-col gap-6">
            {proofs.length === 0 && (
              <p className="text-slate-500 text-sm">{t('portfolio.no_proof')}</p>
            )}

            {/* Grille d'images (côte à côte, même hauteur, cliquables) */}
            {images.length > 0 && (
              <div className={`grid gap-4 ${images.length === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
                {images.map((proof, i) => (
                  <figure
                    key={i}
                    onClick={() => setSelectedIndex(i)}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex flex-col cursor-zoom-in"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={proof.url}
                        alt={proof.label || item.activite}
                        loading="lazy"
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badge loupe discret au survol */}
                      <span className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/70 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zm0-11v6m-3-3h6" />
                        </svg>
                      </span>
                    </div>

                    {proof.label && (
                      <figcaption className="px-3 py-2 text-xs text-slate-600 font-medium border-t border-slate-100">
                        {proof.label}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}

            {/* Liste des liens / PDF */}
            {links.length > 0 && (
              <div className="flex flex-col gap-3">
                {links.map((proof, i) => (
                  <a
                    key={i}
                    href={proof.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-brand font-medium hover:bg-slate-50 transition-colors"
                  >
                    🔗 {proof.label || proof.url}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX PLEIN ÉCRAN (Quand on clique sur une image) */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedIndex(null)}
        >
          {/* Bouton fermer en haut à droite */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-5 right-6 text-white/70 hover:text-white text-4xl leading-none cursor-pointer z-10"
            aria-label="Fermer l'aperçu"
          >
            &times;
          </button>

          {/* Flèche précédente (si plusieurs images) */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
              }}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Image précédente"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image en grand */}
          <div
            className="max-w-5xl max-h-[82vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.url}
              alt={activeImage.label || item.activite}
              className="max-w-full max-h-[76vh] object-contain rounded-xl shadow-2xl"
            />
            {activeImage.label && (
              <p className="mt-3 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium">
                {activeImage.label}
                {images.length > 1 && ` (${selectedIndex + 1}/${images.length})`}
              </p>
            )}
          </div>

          {/* Flèche suivante (si plusieurs images) */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((prev) => (prev + 1) % images.length)
              }}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
              aria-label="Image suivante"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  )
}