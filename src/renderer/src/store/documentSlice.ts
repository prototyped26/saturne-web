import { IDocument } from '../type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


type StateType = {
  documents: IDocument[],
  document: IDocument | null
}

const initialState: StateType = {
  documents: [],
  document: null
}

export const documentSlice = createSlice({
  name: 'document',
  initialState: initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<IDocument[]>) => {
      state.documents = action.payload
    },
    setDocument: (state, action: PayloadAction<IDocument>) => {
      state.document = action.payload
    }
  }
})

export const { setDocuments, setDocument } = documentSlice.actions
export default documentSlice.reducer
