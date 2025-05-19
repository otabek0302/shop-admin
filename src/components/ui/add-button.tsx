import Link from 'next/link';

import { PlusIcon } from 'lucide-react';
import { Button } from './button';

const AddButton = ({ link, title }: { link: string; title: string }) => {
  return (
    <Button asChild className="bg-primary text-white">
      <Link href={link}>
        <PlusIcon className="h-4 w-4" />
        {title}
      </Link>
    </Button>
  );
};

export default AddButton;
