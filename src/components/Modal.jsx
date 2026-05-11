// ============================================================
// Modal.jsx – src/components
// ============================================================
// Återanvändbar modal-komponent med mörk overlay.
// Används för alla formulär i appen (insättning, uttag, osv).
//
// Props:
//   title    = rubrik som visas i toppen av modalen
//   onClose  = funktion som kallas när användaren stänger modalen
//   children = formuläret eller innehållet inuti modalen
// ============================================================

// Modal tar emot titel, stängningsfunktion och barnkomponenter
export default function Modal({ title, onClose, children }) {
  return (
    // Mörk overlay som täcker hela skärmen
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

      {/* Modal-rutan centrerad på skärmen */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">

        {/* Rubrik och stäng-knapp i toppen */}
        <div className="flex items-center justify-between mb-5">
          {/* Modal-rubriken */}
          <h2 className="text-lg font-semibold text-white">{title}</h2>

          {/* Stäng-knapp – anropar onClose när man klickar */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Modalens innehåll – formulär skickas in som children */}
        {children}
      </div>
    </div>
  )
}
