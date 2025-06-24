import { Add01Icon } from 'hugeicons-react';
import React, { useState } from 'react';
import { SheetHeader, SheetTitle } from '../ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from 'recharts';
import Input from '../Input';

// Define props interface for clarity
interface NewProps {
  onClose: () => void; // Function to call when the component should close
  onTaskCreated: () => void; // Function to call when a task is successfully created
}

const New: React.FC<NewProps> = ({ onTaskCreated }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save the new task (e.g., send to API, update state)
    console.log('Task created!');
    // After task is created, navigate back to the list
    onTaskCreated();
  };
  const [formData, setFormData] = useState({
    Titre: '',
    Description: '',
    Duree: '',
  });

  return (
    <div className='flex flex-col gap-2 py-2 px-3'>
      <SheetHeader>
        <SheetTitle>Créer une tâche</SheetTitle>
      </SheetHeader>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        {' '}
        <Input
          type='text'
          name='titre'
          placeholder='Titre'
          className='w-full h-full py-2 outline-0'
          id={''}
          label={''}
          value={formData.Titre}
          onChange={(e) => setFormData({ ...formData, Titre: e.target.value })} // Update state on change
        />
        <Input
          type='text'
          name='description' // Changed name to 'description' for clarity
          placeholder='Description'
          className='w-full h-full py-2 outline-0'
          id={''}
          label={''}
          value={formData.Description}
          onChange={(e) =>
            setFormData({ ...formData, Description: e.target.value })
          } // Update state on change
        />
        <div className='space-y-2'>
          <Label>Duree</Label>
          <Select
            value={formData.Duree}
            onValueChange={(value) =>
              setFormData({ ...formData, Duree: value })
            }
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Sélectionner la duree' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='15'>15 Minutes</SelectItem>
              <SelectItem value='30'>30 Minutes</SelectItem>
              <SelectItem value='45'>45 Minutes</SelectItem>
              <SelectItem value='60'>1 Heure</SelectItem>
              <hr />
              <SelectItem value='75'>1 Heure 15 Minutes</SelectItem>
              <SelectItem value='90'>1 Heure 30 Minutes</SelectItem>
              <SelectItem value='105'>1 Heure 45 minutes</SelectItem>
              <SelectItem value='120'>2 Heure</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <button
          type='submit' // Important: set type to "submit" for form submission
          name='Creer une tache'
          className='custom-button-gradient py-2 w-full flex flex-row items-center gap-2 px-3 rounded-lg justify-center' // Added justify-center for icon+text alignment
        >
          <Add01Icon size={20} />
          Créer une tâche
        </button>
      </form>
    </div>
  );
};

export default New;
