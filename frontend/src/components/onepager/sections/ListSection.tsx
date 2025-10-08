/**
 * List Section Component
 *
 * Renders bullet point list (AI type: "list")
 * Content: string[]
 */

import { VStack, HStack, Text, Input, Button, Box } from '@chakra-ui/react';
import { useState } from 'react';

interface Props {
  items: string[];
  isEditing?: boolean;
  onUpdate?: (newItems: string[]) => void;
}

export function ListSection({ items, isEditing, onUpdate }: Props) {
  const [editableItems, setEditableItems] = useState(items);

  const handleItemChange = (index: number, value: string) => {
    const updated = [...editableItems];
    updated[index] = value;
    setEditableItems(updated);
    onUpdate?.(updated);
  };

  const handleAddItem = () => {
    const updated = [...editableItems, ''];
    setEditableItems(updated);
    onUpdate?.(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = editableItems.filter((_, i) => i !== index);
    setEditableItems(updated);
    onUpdate?.(updated);
  };

  if (isEditing && onUpdate) {
    return (
      <VStack align="stretch" gap={2}>
        {editableItems.map((item, index) => (
          <HStack key={index} gap={2}>
            <Text fontSize="20px">•</Text>
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              flex="1"
              border="2px solid"
              borderColor="#864CBD"
            />
            <Button
              size="sm"
              colorScheme="red"
              onClick={() => handleRemoveItem(index)}
            >
              Remove
            </Button>
          </HStack>
        ))}
        <Button size="sm" onClick={handleAddItem} colorScheme="purple" variant="outline">
          + Add Item
        </Button>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap={3}>
      {items.map((item, index) => (
        <HStack key={index} align="start" gap={3}>
          <Box
            w="8px"
            h="8px"
            borderRadius="full"
            bg="#864CBD"
            mt="8px"
            flexShrink={0}
          />
          <Text fontSize={{ base: '16px', md: '18px' }} color="#4a5568" lineHeight="1.6">
            {item}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}
