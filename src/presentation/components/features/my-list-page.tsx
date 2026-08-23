import { useState } from 'react';
import { Filter, Edit, PlayCircle, Bookmark } from 'lucide-react';
import {
  SectionHeader,
  ContinueWatchingCard,
  PosterCard,
  SidebarUserProfile,
  MiniPlayerBar,
  Button,
} from '@/presentation/components/ui';
import { mockMyListContinueWatching, mockMyListSaved } from '@/presentation/data';

export function MyListPage() {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="space-y-10 lg:pt-8 pb-32">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary">Mi Lista</h1>
          <p className="text-text-secondary mt-1">Tus películas y series guardadas para ver después.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={Filter} iconPosition="left" size="sm">
            Filtrar
          </Button>
          <Button
            variant="secondary"
            icon={Edit}
            iconPosition="left"
            size="sm"
            onClick={() => {
              setShowEdit(!showEdit);
            }}
          >
            {showEdit ? 'Cancelar' : 'Editar Lista'}
          </Button>
        </div>
      </header>

      <SectionHeader title="Continuar Viendo" icon={PlayCircle} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockMyListContinueWatching.map((item) => (
          <ContinueWatchingCard size="lg" key={item.id} {...item} />
        ))}
      </div>

      <SectionHeader title="Guardados Recientemente" icon={Bookmark} />
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-visible lg:pb-0">
        {mockMyListSaved.map((item) => (
          <PosterCard key={item.id} {...item} />
        ))}
      </div>

      <MiniPlayerBar
        title="Crónicas de Acero (Ep 4)"
        thumbnailUrl="https://picsum.photos/seed/cronicas-acero-thumb/200/200"
        isPlaying={true}
        progress={55}
      />

      <SidebarUserProfile name="Alex M." isPremium={true} />
    </div>
  );
}