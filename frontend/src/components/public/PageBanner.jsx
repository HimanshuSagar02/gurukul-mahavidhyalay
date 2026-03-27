export const PageBanner = ({ title, subtitle }) => (
  <section className="page-banner">
    <div className="container">
      <span className="page-banner__eyebrow">Gurukul Mahavidyalya</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  </section>
);
