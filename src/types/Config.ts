/**
 * Configuration for the OFCP App JS SDK
 */
export class OfcpConfig {
  /**
   * The base URL for the widget UIs
   */
  public widgetBaseURL: string = 'https://tecsafe.github.io/app-ui'

  /**
   * A list of allowed origins for the SDK to communicate with
   */
  public allowedOrigins: string[] = ['https://tecsafe.github.io']

  /**
   * Styles configuration for the apps. TBD.
   */
  public styles: any = {}
}
