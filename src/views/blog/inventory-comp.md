
# Inventory Component in Bevy: A Deep Dive

In this blog post, we'll explore the implementation of an inventory component for a game built with the Bevy game engine. We'll dive into the details of how inventory slots work, how events are handled, and the logic checking involved.

## Inventory Component

The `InventoryComponent` is the core of the inventory system. It contains a `HashMap` called `items` that maps slot indices to `ItemSlotData`. It also has a vector called `initial_equipment` that stores the names of initial equipment items.


All Units in my game get one of these.  Monsters use it to hold equipped weapons, chests use it to hold items which can be looted, dead monsters corpses use it so they can be looted, etc. 

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


The ItemSlotData struct stores data about each item including the item type loaded from a RON file [bevy-asset-loader] as well as ephemeral data like the stack quantity, durability, charges, and so forth.


```rust

#[derive(  Debug, Clone, Serialize, Deserialize)]
pub struct ItemSlotData {
      item_type_name: String, //this should be short name like 'dagger' 
      item_type : ItemType, 
    
      quantity: Option<u32>,  //only matters if stackable
      durability: Option<u32>,
      charges: Option<u32>,
      enchantments: Option<Vec<String>>, //file stem of a condition type
      rune: Option<String>,
}

```



```rust
#[derive(Debug, Asset, Clone, Serialize, Deserialize)]
pub(crate) struct ItemType {
    pub render_name: String,

    pub preview_model: Option<String>,
    pub icon_texture: Option<String>,
    pub icon_material: Option<EnvironmentMaterialType>,

    pub inventory_container_dimensions: Option<[u32; 2]>,

    pub model_swappable_materials: Option<SwappableMaterialsMap>,

    pub item_model_type: ItemModelType,   
    pub equipment_data: Option<EquipmentData>,
}


impl TypePath for ItemType {
    fn short_type_path() -> &'static str {
        "item.ron"
    }
    fn type_path() -> &'static str {
        "item.ron"
    }
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
                
                
                 let Some(mut inv_comp) = inventory_query.get_mut(*inventory_entity).ok() else {
                    continue;
                };

                //  let item_type_name =  item_type_name.clone();

                let Some(item_type) =   item_system_data.item_types.get( item_type_name.as_str()  )   .map(|h| item_types.get(h)  ).flatten() else{
                      warn!("no item data ");
                      continue
                } ;
                   

              

                //let item_type_data_map = &item_system_data.item_types;
 

                let equipment_slot_type = item_type
                    .equipment_data
                    .as_ref()
                    .map(|data| data.equipment_slot_type);

                let slot_index =
                    inv_comp.find_best_slot_index_for_item_of_type(item_type);


                let item_slot_data = ItemSlotData::new_from_item_type(item_type_name.clone(), item_type.clone());

                let add_item_succeeded = inv_comp.try_add_item(item_slot_data.clone() , slot_index  );

                if let Err(e) = add_item_succeeded {
                    warn!("{:?} ",e);
                    warn!("need to spawn item at feet ...  ?");
                    //spawn the item at chars feet but somehow make it NOT do interact ...
                }


            }
           
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
        item_type_data: &ItemType
        ) -> Result<(),InventoryError>{

        let item_slot_is_in_equipment_group = item_slot_index < InventoryContainer::get_inventory_container_slot_offset();
        
 


        let equipment_slot_type_at_slot = EquipmentSlotType::from_inventory_slot_index( item_slot_index ) ; 
        let item_equipment_slot_type = item_type_data.equipment_data.as_ref().map(|eq| eq.equipment_slot_type);


        if item_slot_is_in_equipment_group {

            if  item_equipment_slot_type.is_none() || 
              item_equipment_slot_type != equipment_slot_type_at_slot  
            {
                return Err(InventoryError::EquipmentSlotMismatch);
            }
        }else{

                //find the mask of slots that are taken up by existing items... 

            //let existing_items:HashMap<usize,ItemType> = HashMap::new();

           
         
            let occupied_slot_mask: HashSet<usize> = self.items.iter().fold(HashSet::new(), |mut mask, (slot_index, item_slot_data)| {  //FIXME 
                let item_dimensions = item_slot_data.item_type.inventory_container_dimensions.unwrap_or([1, 1]); //make sure this is set / correctly cached !!  not stale cache .. 
                let all_item_slots = InventoryContainer::get_all_container_slots_for_item(*slot_index, item_dimensions);
                mask.extend(all_item_slots);
                mask
            });

            info!("occupied_slot_mask is {:?}",occupied_slot_mask);




             let inventory_container_dimensions = InventoryContainer::get_inventory_container_dimensions();  // 10 by 6 
             let item_container_dimensions = &item_type_data.inventory_container_dimensions;

             let all_container_slots = InventoryContainer::get_all_container_slots_for_item(
                item_slot_index,
                 item_container_dimensions.unwrap_or(  [1,1] )
              );


             for container_slot_index in all_container_slots{

                //make sure they are in bounds 
                //let container_width = inventory_container_dimensions[0] as usize;
                let container_slot_coords = InventoryContainer::slot_index_to_slot_coords(container_slot_index);

                if container_slot_coords[0] >= inventory_container_dimensions[0] as usize {
                    return Err(InventoryError::InventoryContainerBoundsExceeded);

                }

                if container_slot_coords[1] >= inventory_container_dimensions[1] as usize {
                    return Err(InventoryError::InventoryContainerBoundsExceeded);

                }

                if occupied_slot_mask.contains( &container_slot_index ) {

                     return Err(InventoryError::InventorySlotOccupied);
                }

             }


        }


        return Ok(())
    }
```



The inventory component in Bevy provides a flexible and extensible system for managing player inventory and equipment. By utilizing events, slots, and logic checking, it ensures a smooth and reliable inventory management experience.

Here is the full code in a gist: 

[Github: Inventory Component Gist](https://gist.github.com/ethereumdegen/3c80af2dc9c5012d3cd743b668270ecd)


I hope this deep dive into this Bevy game inventory component has given you a better understanding of how it works under the hood. Feel free to explore the code further and adapt it to your specific game requirements.