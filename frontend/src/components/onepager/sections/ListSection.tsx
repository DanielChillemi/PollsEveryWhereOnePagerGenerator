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
      <VStack align="stretch" gap={1.5}>
        {editableItems.map((item, index) => (
          <HStack key={index} gap={1.5}>
            <Text fontSize="14px">•</Text>
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              flex="1"
              size="sm"
              fontSize="13px"
              px={3}
              border="2px solid"
              borderColor="#864CBD"
            />
            <Button
              size="xs"
              colorScheme="red"
              onClick={() => handleRemoveItem(index)}
              fontSize="xs"
            >
              Remove
            </Button>
          </HStack>
        ))}
        <Button size="xs" onClick={handleAddItem} colorScheme="purple" variant="outline" fontSize="xs">
          + Add Item
        </Button>
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap={1.5}>
      {items.map((item, index) => (
        <HStack key={index} align="start" gap={2}>
          <Box
            w="5px"
            h="5px"
            borderRadius="full"
            bg="#864CBD"
            mt="6px"
            flexShrink={0}
          />
          <Text fontSize={{ base: '13px', md: '14px' }} color="#4a5568" lineHeight="1.5">
            {item}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}
