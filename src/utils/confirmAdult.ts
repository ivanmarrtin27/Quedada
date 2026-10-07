import { Alert } from 'react-native';

/** Confirmación de modo Picante (toggles, categorías, juegos). */
export function confirmAdultContent(onConfirm: () => void) {
  Alert.alert(
    'Modo Picante',
    'Este contenido es más atrevido y pensado para mayores de edad. ¿Seguimos?',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Entrar', onPress: onConfirm },
    ],
  );
}

/** Activa Picante solo tras confirmar; Suave entra directo. */
export function requestSpicyLevel(nextSpicy: boolean, onChange: (spicy: boolean) => void) {
  if (!nextSpicy) {
    onChange(false);
    return;
  }
  confirmAdultContent(() => onChange(true));
}
