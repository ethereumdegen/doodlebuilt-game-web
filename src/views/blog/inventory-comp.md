
# Inventory Component in Bevy: A Deep Dive

In this blog post, we'll explore the implementation of an inventory component for a game built with the Bevy game engine. We'll dive into the details of how inventory slots work, how events are handled, and the logic checking involved.

## Inventory Component

The `InventoryComponent` is the core of the inventory system. It contains a `HashMap` called `items` that maps slot indices to `ItemSlotData`. It also has a vector called `initial_equipment` that stores the names of initial equipment items.

```rust
#[derive(Component, Default, Serialize, Deserialize, Clone, Debug)]
pub struct InventoryComponent {
   pub items: HashMap<usize, ItemSlotData>,
   pub initial_equipment: Vec<String>,
}

```


The `InventoryComponent` provides methods for adding items to the inventory, setting items at specific slots, and retrieving equipped items. It also includes logic for finding the best slot index for an item based on its type and checking if a slot is valid for a given item.


## Inventory Slots
Inventory slots are represented by indices in the items HashMap. Slots 0 to 99 are reserved for equipment slots, while the actual inventory starts at slot 100.


The InventoryContainer struct provides utility functions for working with inventory slots, such as converting between slot indices and slot coordinates, and getting the dimensions of the inventory container.


```rust
pub struct InventoryContainer {}

impl InventoryContainer {
    pub fn get_inventory_container_slot_offset() -> usize {
        100
    }

    pub fn get_inventory_container_dimensions() -> [u32; 2] {
        [10, 6]
    }

    // ...
}

```


## Inventory Events

The inventory system uses events to handle actions such as adding items to the inventory, adding enchantments to items, and swapping item slots.

The InventoryEvent enum defines the different event types:

```rust
#[derive(Event)]
pub enum InventoryEvent {
    AddItemToInventory {
        inventory_entity: Entity,
        item_type_name: String,
        stack_size: Option<u32>,
        charges: Option<u32>,
        source_type: ItemAddSourceType,
        auto_equip: bool,
    },
    AddEnchantmentToItem {
        inventory_entity: Entity,
        equipment_slot: EquipmentSlotType,
        condition_type_name: String,
    },
    SwapItemSlots {
        source_slot_index: usize,
        target_slot_index: usize,
    },
}
```

## Handling Inventory Events

The handle_inventory_events function is responsible for processing inventory events. It matches on the event type and performs the corresponding actions.


For example, when handling the AddItemToInventory event, it retrieves the InventoryComponent for the specified entity, finds the best slot index for the item based on its type, and attempts to add the item to the inventory using the try_add_item method.

```rust 

fn handle_inventory_events(
    mut inventory_event_reader: EventReader<InventoryEvent>,
    mut inventory_query: Query<&mut InventoryComponent>,
    item_system_data: Res<ItemSystemTypeAssets>,
    item_types: Res<Assets<ItemType>>,
) {
    for evt in inventory_event_reader.read() {
        match evt {
            InventoryEvent::AddItemToInventory {
                inventory_entity,
                item_type_name,
                source_type: _,
                stack_size,
                charges,
                auto_equip,
            } => {
                // ...
                let slot_index = inv_comp.find_best_slot_index_for_item_of_type(item_type);
                let item_slot_data = ItemSlotData::new_from_item_type(item_type_name.clone(), item_type.clone());
                let add_item_succeeded = inv_comp.try_add_item(item_slot_data.clone(), slot_index);
                // ...
            }
            // ...
        }
    }
}
```

## Logic Checking

The inventory component includes logic checking to ensure the validity of inventory operations. For example, the slot_is_valid_for_item method checks if a given slot index is valid for a specific item type.


It takes into account factors such as whether the slot is in the equipment group, if the item type matches the equipment slot type, and if the slot is already occupied by another item.

```rust
pub fn slot_is_valid_for_item(
    &self,
    item_slot_index: usize,
    item_type_data: &ItemType,
) -> Result<(), InventoryError> {
    // ...
    if item_slot_is_in_equipment_group {
        if item_equipment_slot_type.is_none() || item_equipment_slot_type != equipment_slot_type_at_slot {
            return Err(InventoryError::EquipmentSlotMismatch);
        }
    } else {
        // ...
        for container_slot_index in all_container_slots {
            if occupied_slot_mask.contains(&container_slot_index) {
                return Err(InventoryError::InventorySlotOccupied);
            }
        }
    }
    // ...
}
```



The inventory component in Bevy provides a flexible and extensible system for managing player inventory and equipment. By utilizing events, slots, and logic checking, it ensures a smooth and reliable inventory management experience.

Here is the full code in a gist: 

[Github: Inventory Component Gist](https://gist.github.com/ethereumdegen/3c80af2dc9c5012d3cd743b668270ecd)


I hope this deep dive into this Bevy game inventory component has given you a better understanding of how it works under the hood. Feel free to explore the code further and adapt it to your specific game requirements.