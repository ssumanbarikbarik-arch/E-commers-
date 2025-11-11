import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddressesPage() {

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>My Addresses</CardTitle>
                    <CardDescription>Manage your shipping addresses.</CardDescription>
                </CardHeader>
                <CardContent>
                   <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Default Address</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            <p>Alex Doe</p>
                            <p>123 Main St</p>
                            <p>Anytown, CA 12345</p>
                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                        </CardFooter>
                   </Card>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="John"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="123 Main St"/>
                    </div>
                     <div className="grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="Anytown"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" placeholder="CA"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip">Zip Code</Label>
                            <Input id="zip" placeholder="12345"/>
                        </div>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button>Save Address</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
