import { Link } from 'react-router-dom';
import { Tag, MapPin, Calendar } from 'lucide-react';
import { TypeBadge, StatusBadge } from './Badges';
import { formatDate } from '../utils/helpers';

// Card for one item. "children" is optional extra content shown at the bottom
// (the My Reports page uses it for Edit / Delete buttons).
function ItemCard({ item, children }) {
  return (
    <div className="card flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/items/${item._id}`} className="flex-1">
        {/* Show the photo only if this report has one */}
        {item.image && (
          <img src={item.image} alt={item.title} loading="lazy" className="h-40 w-full object-cover" />
        )}

        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={item.type} />
            <StatusBadge status={item.status} />
          </div>

          <h3 className="mt-3 line-clamp-1 text-lg font-semibold text-slate-900">{item.title}</h3>

          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Tag size={15} className="shrink-0 text-slate-400" /> {item.category}
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-slate-400" />
              <span className="line-clamp-1">{item.location}</span>
            </li>
            <li className="flex items-center gap-2">
              <Calendar size={15} className="shrink-0 text-slate-400" /> {formatDate(item.date)}
            </li>
          </ul>
        </div>
      </Link>

      {children && <div className="border-t border-slate-100 bg-slate-50/60 p-3">{children}</div>}
    </div>
  );
}

export default ItemCard;
