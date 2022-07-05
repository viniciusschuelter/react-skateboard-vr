import {skateDecks} from "../mocks/skate-decks";
import {skateParts} from '../mocks/skate-parts';

export const apiService = {
  fetchTemplate,
  filterElements,
  fetchPartsNames,
  fetchPartsByCategory
};

async function fetchPartsNames() {
  return skateParts.map((item: any) => item.part);
}

async function fetchPartsByCategory(name: any) {
  const filtered = skateParts.filter((item: any) => item.part === name);
  return filtered[0];
}

async function fetchTemplate(id: any) {
  const filtered = skateDecks.filter((templates: any) => templates.id === id);
  return filtered[0];
}

async function filterElements(search: any, elements: any, category: any) {
  if (elements && elements.length && category) {
    const value = search;
    const val = value.toString().toLowerCase();
    const valueArray = val.split(" ");

    if (value) {
      const filteredElementsData = elements.filter((item) => {
        return valueArray.every((eachKey) => {
          if (!eachKey.length) {
            return true;
          }
          return item.name.toString().toLowerCase().includes(eachKey);
        });
      });
      return {
        data: filteredElementsData,
      };
    }
  }
}