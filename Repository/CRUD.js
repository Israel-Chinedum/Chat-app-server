class CRUD {
  // ====== CHECK IF A PROPERTY/KEY EXISTS ======
  async exists({ model, key, value }) {
    try {
      //  ====== ERROR CHECK ======
      if (!model || !key || !value)
        throw new Error("key, value, and model values must all be provided!");

      //   ====== CONT. ======
      const exists = await model.exists({ [key]: value });
      if (exists) return true;
      return false;
    } catch (error) {
      // ====== ERROR HANDLER ======
      console.error("ERROR: ", error);
    }
  }
}

export const crud = new CRUD();
