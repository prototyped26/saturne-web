import { AxiosError } from 'axios'
//typeof AxiosError
export function getMessageErrorRequestEx(e: any): string {
  let msg = ""
  try {
    switch (e.code) {
      case AxiosError.ERR_BAD_REQUEST: {
       if (e.response.data.errors === null) {
         msg = e.response.data.message
       } else {
         msg = e.response.data.errors.toString()
       }
      }
      break
      default:
        msg = e.message
        break
    }
  } catch (ex) {
    msg = "Erreur de lecture " + ex
  }
  return msg
}
