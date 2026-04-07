# Portfolio Setup Guide - Šta Još Trebaj da Uradi

## ✅ Already Done
- ✓ Ekstraktovani svi hardkodirani podaci u `src/data/` strukturu
- ✓ Refaktorisana home stranica (`app/page.tsx`) da koristi dinamičke podatke
- ✓ Ažurirana metadata u `app/layout.tsx` sa SEO optimizacijom
- ✓ Kreirane public folder strukture za slike

---

## 📝 Šta Trebaj da Dodaš Ručno

### 1. **Slike Projekata** 
📁 **Lokacija:** `public/projects/`

Trebam 4 slike:
- `balkanflix.jpg` → Balkanflix streaming platform
- `ko-zna-zna.jpg` → Ko Zna Zna quiz game
- `wama-agency.jpg` → WAMA Agency website
- `nikola-video.jpg` → Nikola Video portfolio

**Preporuka:** 1200x900px (4:3 aspect ratio), optimizovane za web

---

### 2. **Avatar slike** 
📁 **Lokacija:** `public/avatars/`

Trebam 2 slike:
- `ana-petrovic.jpg` → Ana Petrović avatar
- `marko-djordjevic.jpg` → Marko Đorđević avatar

**Preporuka:** 80x80px (1:1), ili 40x40px (vidjive se malo u zatvorenoj formi)

---

### 3. **OG Preview Slika** 
📁 **Lokacija:** `public/og-image.jpg`

Glavna slika za društvene mreže (LinkedIn, Twitter, Facebook)

**Preporuka:** 1200x630px (konačne dimenzije za Facebook)

---

### 4. **Ažuriraj Config Podatke**
📁 **Fajl:** `src/data/config.ts`

Odmah zameni ove vrednosti sa svojim podacima:
```typescript
export const siteConfig = {
  url: "https://portfolio.com",  // ← Tvoj domain
  email: "tijoj@email.com",      // ← Tvoj email
  // Dodaj social profile linkove ako hoćeš
  social: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
  },
};
```

---

### 5. **Ažuriraj Sadržaj Detalja**
📁 **Fajl:** `src/data/portfolio.ts`

Ako trebaju bilo kakve izmene na tekstovima, stringovima, ili dodaj nove projekte:
```typescript
projectsData.push({
  id: "new-project",
  title: "Project Name",
  tag: "Project Type",
  result: "Project description...",
  image: "/projects/project-name.jpg",
  link: "#", // Dodaj link ka detaljnoj stranici
  year: "2024",
});
```

---

### 6. **Dodaj Project Details Stranice** (Opciono)
Ako želiš pojedinačne stranice za svaki projekat:
- Kreiraj `app/projects/[id]/page.tsx` dinamičku rutu
- Ispuni projekat iz `projectsData` po `id`
- Dodaj link iz `projectsData[].link` ka toj stranici

---

### 7. **Ispravke koje bi te Trebale**

**Contact Form** (ako hoćeš):
- Trenutno je samo email link (`mailto:`)
- Trebalo bi da doddaš pravi form sa backend-om (npr. Formspree, EmailJS, ili custom API)

**Project Links**:
- Svi projekti trenutno imaju `link: "#"`
- Trebalo bi da ispuniš sa stvarnim linkovima ili stranicama sa detaljima

---

## 🚀 Kako da pokrenete Lokalno

```bash
npm run dev
# Stranica se otvara na http://localhost:3000
```

---

## 📊 Struktura Podataka

**Ako trebaj da razumeš šta je gde:**

```
src/data/
├── portfolio.ts    ← Svi sadržaj sekcije (projekti, testimonijali, process)
└── config.ts       ← Site meta podaci, email, URL

app/
├── layout.tsx      ← Root layout + SEO metadata  
├── page.tsx        ← Home stranica (koristi podatke iz src/data/)
└── globals.css     ← Tailwind + globalni stilovi

public/
├── projects/       ← Slike projekata
├── avatars/        ← Avatar slike  
└── og-image.jpg    ← OG preview
```

---

## 💾 Kako da Deployuješ

1. **Prebaci sve slike u `public/` folder** 
2. **Izmeni `src/data/config.ts`** sa tvojim informacijama
3. **Pozovi u terminal:**
   ```bash
   npm run build
   ```
4. **Deploj na Vercel, Netlify ili gde već hoćeš**

---

## ✨ Next Steps (Dodatne Opcije)

- [ ] Dodaj Next.js Image komponent za optimizovane slike
- [ ] Implementiraj contact form sa backend validacijom
- [ ] Dodaj individual project pages sa detaljima  
- [ ] Postavi sitemap.xml i robots.txt za SEO
- [ ] Dodaj dark/light mode toggle (ako trebaj)
- [ ] Setuj Analytics (Google Analytics, Vercel Analytics)

---

**Sve je sprema za slike! 🎉**
