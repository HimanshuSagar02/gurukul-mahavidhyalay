export const SectionHeading = ({ eyebrow, title, description, align = 'left' }) => (
  <div className={`section-heading section-heading--${align}`}>
    {eyebrow ? <span className="section-heading__eyebrow">{eyebrow}</span> : null}
    <h2>{title}</h2>
    {description ? <p>{description}</p> : null}
  </div>
);
