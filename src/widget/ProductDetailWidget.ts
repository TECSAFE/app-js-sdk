import { BaseWidget } from '../types/BaseWidget'

/**
 * A widget that promotes OFCP on a product detail page, or similar
 */
export class ProductDetailWidget extends BaseWidget {
    /**
     * @inheritdoc
     */
    protected readonly uiPath = 'product-detail'
}
