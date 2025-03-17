import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <div className="w-full h-full mt-16 flex items-center justify-center">
      <span>Click the <FontAwesomeIcon icon={faBars} className="h-[25px]"/> icon to get started!</span>
    </div>
  );
}
