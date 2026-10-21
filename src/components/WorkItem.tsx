import type { ExperienceItem } from '../app/props';

export default function WorkItem({ time, company, title, location, content, companyURL }: ExperienceItem) {
  return (
    <article className="experience-entry">
      <p className="experience-date">{time}</p>
      <h3>{companyURL ? <a href={companyURL} target="_blank" rel="noopener noreferrer">{company} <span aria-hidden="true">↗</span></a> : company}</h3>
      <p className="experience-role">{title}</p>
      <p className="experience-location">{location}</p>
      <p className="experience-description">{content.intro}</p>
      {content.list.length > 0 && <details className="experience-details"><summary>Role highlights</summary><ul>{content.list.map((item) => <li key={item}>{item}</li>)}</ul></details>}
    </article>
  );
}
