import { useState } from 'react';

export default function useToggle(defaultValue = false): [boolean, () => void] {
  const [state, setState] = useState(defaultValue);

  function toggleState() {
    setState((state) => !state);
  }

  return [state, toggleState];
}
