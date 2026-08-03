'use client'

const PROCEDURES = [
  'Breast Reduction or Uplift',
  'Abdominoplasty',
  'Arm or Thigh Lift',
  'Body Contouring after Weight Loss',
  'Face or Eyelid Surgery',
  'Skin / Mole / Lesion',
  'Not sure yet',
]

export default function ContactForm() {
  return (
    <form className="contact-form reveal" onSubmit={(e) => e.preventDefault()}>
      <div className="field">
        <label>Full name</label>
        <input type="text" name="name" placeholder="Your name" />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Email</label>
          <input type="email" name="email" placeholder="you@email.com" />
        </div>
        <div className="field">
          <label>Phone</label>
          <input type="tel" name="phone" placeholder="Mobile" />
        </div>
      </div>
      <div className="field">
        <label>Procedure of interest</label>
        <select name="procedure">
          {PROCEDURES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Message</label>
        <textarea name="message" rows={3} placeholder="How can we help?" />
      </div>
      <button className="btn btn-pill btn-gold full" type="submit">
        Send enquiry
      </button>
    </form>
  )
}
