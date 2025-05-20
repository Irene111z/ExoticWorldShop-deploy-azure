import { makeAutoObservable } from "mobx";

class CategoryContext {
  constructor() {
    this._categories = [
      { id: 1, name: "Птахи", parentId: null },
      { id: 2, name: "Гризуни", parentId: null },
      { id: 3, name: "Їжа", parentId: 2 },
      { id: 4, name: "Клітки", parentId: 2 },
      { id: 5, name: "Аксесуари в клітку", parentId: 2 },
      { id: 6, name: "Гамаки", parentId: 5 },
      { id: 7, name: "Будиночки", parentId: 5 },
      { id: 8, name: "Полички", parentId: 5 },
      { id: 9, name: "Іграшки", parentId: 2 },
      { id: 10, name: "Наповнювач", parentId: 2 },
      { id: 11, name: "Переноски", parentId: 2 },
      { id: 12, name: "Рептилії", parentId: null },
      { id: 13, name: "Ссавці", parentId: null },
    ];
    makeAutoObservable(this);
  }

  setCategories(categories) {
    this._categories = categories;
  }

  get categories() {
    return this._categories;
  }
}

export default new CategoryContext();
