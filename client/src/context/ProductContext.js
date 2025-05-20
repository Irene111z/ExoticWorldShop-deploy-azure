import {makeAutoObservable} from 'mobx'

export default class ProductContext{
    constructor(){
        this._categories = [
            {id:1, name:'гризуни'},
            {id:2, name:'птахи'}
        ]
        this._brands = [
            {id:1, name:'vitacraft'},
            {id:2, name:'beaphar'}
        ]
        this._product_features = [
            { id: 1, name: 'Бренд', description: 'Ferplast', product_id: 31423 },
            { id: 2, name: 'Висота', description: '80 см', product_id: 31423 },
            { id: 3, name: 'Ширина', description: '70 см', product_id: 31423 },
            { id: 4, name: 'Довжина', description: '120 см', product_id: 31423 },
            { id: 5, name: 'Колір', description: 'сірий', product_id: 31423 },
        ]
        this._products = [
            {id:31423, name:'корм для пацючків', description: "Простора триповерхнева клітка від італійського бренду Ferplast створена для максимального комфорту ваших улюбленців. Ідеально підходить для утримання хом'яків, мишей або інших дрібних гризунів. Завдяки кільком рівням, тварини можуть активно рухатися, що забезпечує їм додаткову фізичну активність.Особливості клітки:Просторий дизайн: три рівні для ігор, відпочинку та активності.Висока якість матеріалів: стійка до зносу, нетоксична пластмаса та міцні металеві прути.Інтуїтивна збірка: клітка легко збирається та розбирається для зручного чищення.Це ідеальний вибір для тих, хто шукає надійне та комфортне місце для своїх гризунів!", price:700, disc_price:650, quantity:5, brandId:1, categoryId:1, img:"https://image.maudau.com.ua/webp/size/lg/products/86/fc/c2/86fcc2414eae1272969ecd4bb7e9f3ea.jpg"},
            {id:24902, name:'корм для папуг', description: 'ававаааааа', price:350, disc_price:300, quantity:12, brandId:2, categoryId:2, img:"https://masterzoo.ua/content/images/45/1000x1000l80mc0/korm-dlya-volnistykh-popugaev-vitakraft-premium-menu-1-kg-12413169973843.webp"},
            {id:32358, name:'іграшка для папуг', description: 'ававаааааа', price:120, disc_price:90, quantity:4, brandId:1, categoryId:2, img:"https://masterzoo.ua/content/images/12/1000x1000l80mc0/igrushka-dlya-ptits-trixie-podvesnaya-35-sm-naturalnye-materialy-62329058819984.webp"},
            {id:46950, name:'будинок для гризунів', description: 'будиночок повоаопвп', price:410, quantity:8, brandId:2, categoryId:1, img:"https://masterzoo.ua/content/images/21/1000x1000l80mc0/klitka-dlya-grizuniv-ferplast-burn-100-double-95-x-57-x-121-sm-35829380245576.webp"},
            {id:77425, name:'будинок для змії', description: 'будиночок повоаопвп', price:358, quantity:2, brandId:2, categoryId:1, img:"https://content.rozetka.com.ua/goods/images/big/248939791.jpg"}
        ]
        makeAutoObservable(this)
    }

    setBrands(brands){
        this._brands = brands
    }
    setFeatures(features){
        this._features = features
    }

    setCategories(categories){
        this._categories = categories
    }
    setProducts(products){
        this._products = products
    }

    get brands(){
        return this._brands
    }
    getFeatures(productId) {
        return this._product_features.filter(feature => feature.product_id === productId);
    }
    get categories(){
        return this._categories
    }

    get products(){
        return this._products
    }
    
}