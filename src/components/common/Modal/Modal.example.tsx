import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '@/components/ui/button';

/**
 * Example usage of the Modal component
 * This file demonstrates various modal configurations and use cases
 */

export function BasicModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>Open Basic Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Basic Modal"
        description="This is a simple modal with a title and description"
      >
        <div className="space-y-4">
          <p>This is the modal content. You can put any React components here.</p>
          <p>Click outside the modal or press Escape to close it.</p>
        </div>
      </Modal>
    </div>
  );
}

export function ModalWithFooterExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    console.log('Confirmed!');
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>Open Modal with Footer</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirm Action"
        description="Are you sure you want to proceed with this action?"
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </div>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action will make changes to your account. Please confirm to continue.
        </p>
      </Modal>
    </div>
  );
}

export function ModalSizesExample() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (modalSize: typeof size) => {
    setSize(modalSize);
    setIsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => openModal('sm')}>Small Modal</Button>
        <Button onClick={() => openModal('md')}>Medium Modal</Button>
        <Button onClick={() => openModal('lg')}>Large Modal</Button>
        <Button onClick={() => openModal('xl')}>Extra Large Modal</Button>
        <Button onClick={() => openModal('full')}>Full Screen Modal</Button>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${size.toUpperCase()} Modal`}
        description={`This is a ${size} sized modal`}
        size={size}
      >
        <div className="space-y-4">
          <p>Modal size: {size}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export function FormModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsOpen(false);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Contact Form"
        description="Fill out the form below to send us a message"
        size="lg"
        closeOnOverlayClick={false}
        footer={
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="contact-form">
              Submit
            </Button>
          </div>
        }
      >
        <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function PreventCloseModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (confirmed) {
        setIsOpen(false);
        setHasUnsavedChanges(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>Open Protected Modal</Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Edit Document"
        description="Make changes to your document"
        closeOnOverlayClick={false}
        closeOnEscape={false}
        footer={
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setHasUnsavedChanges(false);
                setIsOpen(false);
              }}
            >
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This modal cannot be closed by clicking outside or pressing Escape to prevent accidental
            data loss.
          </p>
          <textarea
            className="w-full px-3 py-2 border rounded-md min-h-[150px]"
            placeholder="Start typing..."
            onChange={(e) => setHasUnsavedChanges(e.target.value.length > 0)}
          />
        </div>
      </Modal>
    </div>
  );
}

/**
 * All examples in one component for easy testing
 */
export function ModalExamples() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Modal Component Examples</h1>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Basic Modal</h2>
        <BasicModalExample />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Modal with Footer</h2>
        <ModalWithFooterExample />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Different Sizes</h2>
        <ModalSizesExample />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Modal</h2>
        <FormModalExample />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Protected Modal (Prevent Close)</h2>
        <PreventCloseModalExample />
      </section>
    </div>
  );
}
