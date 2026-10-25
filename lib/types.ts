export type Lang = 'id' | 'en'

export interface Section {
  id: string
  num: string
  label: string
  title: string
}

export interface Education {
  year: string
  title: string
  school: string
  gpa: string
  img: string
}

/** Pengalaman magang atau organisasi (urutan sama dengan CV). */
export interface Experience {
  period: string
  role: string
  org: string
  img: string
  points: string[]
}

export interface Certificate {
  kind: string
  title: string
  issuer: string
  desc: string
  imgSrc: string
}

export interface Contact {
  label: string
  value: string
  href: string
}

export interface Content {
  tx: Record<string, string>
  ui: Record<string, string>
  name: string
  fullName: string
  headline: string
  photo: string
  photo2: string
  sections: Section[]
  edu: Education[]
  internships: Experience[]
  orgs: Experience[]
  certs: Certificate[]
  technical: string[]
  personal: string[]
  software: string[]
  contacts: Contact[]
}
