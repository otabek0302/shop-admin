import { Minus, Plus } from 'lucide-react';
import { Button } from './button';
import { useClientOrderStore } from '@/store/client-order-store';

interface CounterProps {
  productId: string;
  value: number;
  max?: number;
  disabled?: boolean;
  size?: 'sm' | 'default';
}

export default function Counter({ 
  productId,
  value, 
  max, 
  disabled = false,
  size = 'default'
}: CounterProps) {
  const { updateQuantity } = useClientOrderStore();
  const isMinDisabled = value <= 0;
  const isMaxDisabled = max !== undefined && value >= max;

  const handleIncrement = () => {
    updateQuantity(productId, value + 1);
  };

  const handleDecrement = () => {
    updateQuantity(productId, value - 1);
  };

  return (
    <div className="flex items-center">
      <Button 
        variant="outline" 
        size={size === 'sm' ? 'icon' : 'default'} 
        className={size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'} 
        onClick={handleDecrement} 
        disabled={isMinDisabled || disabled}
      >
        <Minus className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
        <span className="sr-only">Decrease quantity</span>
      </Button>

      <span className={`mx-3 text-center ${size === 'sm' ? 'w-8' : 'w-10'}`}>
        {value}
      </span>

      <Button 
        variant="outline" 
        size={size === 'sm' ? 'icon' : 'default'} 
        className={size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'} 
        onClick={handleIncrement} 
        disabled={isMaxDisabled || disabled}
      >
        <Plus className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
