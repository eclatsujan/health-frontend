/**
 * Stitch-style placeholder copy when API fields are empty (demo / incomplete profiles).
 */
export const doctorProfileFallback = {
  about(name: string) {
    return `${name} provides patient-centered care with a focus on clear communication and evidence-based treatment. Whether you need a routine visit, help managing a long-term condition, or guidance on prevention, you can expect a calm, respectful experience at every step.`;
  },
  clinicalFocus: [
    'Preventive care & health screenings',
    'Chronic disease follow-up',
    'In-person and teleconsult options where available',
  ],
  specialtiesChips: ['General medicine', 'Preventive care', 'Outpatient consultation'],
  hospitalCard: {
    title: 'Hospital affiliations',
    body: 'This doctor’s hospital affiliations will appear here when they are linked in our directory. You can still request an appointment and our team will confirm the best place for your visit.',
  },
  education:
    'Medical degree and postgraduate training — full credentials are verified with the Nepal Medical Council and updated on this profile.',
  certifications: 'Board certification and additional qualifications will be listed here when provided.',
  clinic: {
    name: 'Outpatient clinic',
    address: 'Clinic address will appear here when added to this profile.',
  },
  fees: 'Consultation fees vary by visit type. Request an appointment and we will confirm the fee before you visit.',
  hours: 'Visits are typically by appointment. Share your preferred date when you request a booking — we will confirm availability.',
  languages: 'Nepali · English',
  license: 'License and registration details are verified for listed providers.',
  reviewsEmpty:
    'No reviews yet. Be the first to share your experience — it helps other patients choose with confidence.',
};
